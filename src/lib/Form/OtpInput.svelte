<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { INPUT_CONFIG, INPUT_SIZE, OTP_TYPE } from "$lib/types"
  import { generateToken, coreSpeed, coreReset } from "$lib/function"
  import { inputClasses, inputContainerClass } from "$lib/Form/form"
  import { HelperText, Label } from "$lib"

  interface Props {
    children?: Snippet,
    value?: string,
    length?: number,
    type?: OTP_TYPE,
    name?: string,
    separatorAfter?: number,
    autofocus?: boolean,
    placeholder?: string,
    oncomplete?: (value: string) => void,
    boxLabel?: (index: number, length: number) => string,
    helperText?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    boxClasses?: string,
    [key: string]: unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    value = $bindable(""),
    length = 6,
    type = "number",
    name,
    separatorAfter,
    autofocus = false,
    placeholder = "",
    oncomplete,
    boxLabel = (i, n) => `Character ${i + 1} of ${n}`,
    helperText,
    size = CTX?.size ?? "md",
    variant = CTX?.variant ?? "bordered",
    rounded = CTX?.rounded ?? "md",
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    reset = CTX?.reset ?? coreReset(),
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    boxClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const WIDTHS: Record<INPUT_SIZE, string> = {
    sm: "w-8",
    md: "w-10",
    lg: "w-12",
    xl: "w-14",
  }

  const fallbackId = generateToken()
  const id = $derived((props.id as string | undefined) ?? fallbackId)
  const count = $derived(Math.max(1, Math.floor(length)))
  const C: INPUT_CONFIG = $derived({ animationSpeed, rounded, size, variant, reset })

  let boxes: HTMLInputElement[] = $state([])
  let digits = $state<string[]>([])
  // The value this component wrote last, so an outside change is told apart from its own
  let ownValue = ""

  $effect(() => {
    const v = value ?? ""
    if (v === ownValue) return
    ownValue = v
    digits = Array.from({ length: count }, (_, i) => v[i] ?? "")
  })

  const allowed = (char: string): boolean => type === "number" ? /[0-9]/.test(char) : /\S/.test(char)

  const commit = () => {
    ownValue = digits.join("")
    value = ownValue
    if (ownValue.length === count) oncomplete?.(ownValue)
  }

  const focusBox = (i: number) => {
    const box = boxes[Math.min(Math.max(i, 0), count - 1)]
    box?.focus()
    box?.select()
  }

  // Writes `text` into the boxes from `start` and leaves focus after the last one written
  const fill = (start: number, text: string) => {
    const chars = [...text].filter(allowed)
    if (!chars.length) return
    let i = start
    for (const char of chars) {
      if (i >= count) break
      digits[i] = char
      i++
    }
    commit()
    focusBox(i >= count ? count - 1 : i)
  }

  const onInput = (i: number, e: Event) => {
    const input = e.currentTarget as HTMLInputElement
    const typed = input.value
    input.value = digits[i] ?? ""
    if (!typed) {
      digits[i] = ""
      commit()
      return
    }
    fill(i, typed)
  }

  const onKeydown = (i: number, e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (digits[i]) {
        digits[i] = ""
        commit()
      } else if (i > 0) {
        digits[i - 1] = ""
        commit()
        focusBox(i - 1)
      }
    } else if (e.key === "Delete") {
      e.preventDefault()
      digits[i] = ""
      commit()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      focusBox(i - 1)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      focusBox(i + 1)
    } else if (e.key === "Home") {
      e.preventDefault()
      focusBox(0)
    } else if (e.key === "End") {
      e.preventDefault()
      focusBox(count - 1)
    }
  }

  const onPaste = (i: number, e: ClipboardEvent) => {
    e.preventDefault()
    fill(i, e.clipboardData?.getData("text") ?? "")
  }
</script>

<div class={twMerge(inputContainerClass(C, false), wrapperClasses)}>
  {#if children}
    <Label for={`${id}-0`} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div class="theui-otp flex items-center gap-2" role="group" aria-describedby={helperText ? `${id}-helper` : null}>
    {#each { length: count }, i (i)}
      <!-- svelte-ignore a11y_autofocus -->
      <input
        bind:this={boxes[i]}
        id={`${id}-${i}`}
        type={type === "password" ? "password" : "text"}
        inputmode={type === "number" ? "numeric" : "text"}
        autocomplete={i === 0 ? "one-time-code" : "off"}
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        maxlength="1"
        {placeholder}
        {...props}
        value={digits[i] ?? ""}
        autofocus={autofocus && i === 0}
        aria-label={boxLabel(i, count)}
        class={twMerge(inputClasses(C, props), `theui-otp-box text-center ${WIDTHS[size as INPUT_SIZE] ?? WIDTHS.md}`, boxClasses)}
        oninput={(e) => onInput(i, e)}
        onkeydown={(e) => onKeydown(i, e)}
        onpaste={(e) => onPaste(i, e)}
        onfocus={(e) => (e.currentTarget as HTMLInputElement).select()}
      />
      {#if separatorAfter && i === separatorAfter - 1 && i < count - 1}
        <span class="theui-otp-separator select-none text-muted" aria-hidden="true">–</span>
      {/if}
    {/each}
  </div>

  {#if name}<input type="hidden" {name} {value} />{/if}

  {#if helperText}
    <HelperText id={id + "-helper"}>
      {#if typeof helperText === "function"}
        {@render helperText()}
      {:else}
        {helperText}
      {/if}
    </HelperText>
  {/if}
</div>
