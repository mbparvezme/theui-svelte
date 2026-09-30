<script lang="ts">
  import type { INPUT_CONFIG, SELECT_DATA } from "$lib/types"
  import { getContext, setContext, type Snippet } from "svelte"
	import { generateToken, coreSpeed, coreReset } from "$lib/function"
	import { inputContainerClass, inputClasses } from "$lib/Form/form"
  import { Label, HelperText } from "$lib"
	import { twMerge } from "tailwind-merge"

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  interface Props {
    children?: Snippet,
    options?: SELECT_DATA[],
    value?: string,
    label?: Snippet|string,
    placeholder?: string,
    helperText?: Snippet|string,
    labelClasses?: string,
    wrapperClasses?: string,
    [key: string] : unknown
  }

  let {
    children,
    options,
    value = $bindable(),
    variant = CTX?.variant ?? "bordered",
    label,
    placeholder,
    // Own variant differs from the group's: follow it; otherwise use the group's floatingLabel
    floatingLabel = variant !== CTX?.variant ? variant === "flat" : (CTX?.floatingLabel ?? variant === "flat"),
    size = CTX?.size ?? "md",
    rounded = CTX?.rounded ?? "md",
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    helperText,
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    reset = CTX?.reset ?? coreReset(),
    ...props
  } : Props & INPUT_CONFIG = $props()

  const id = $derived((props.id as string | undefined) ?? generateToken())
  let C:INPUT_CONFIG = $derived({animationSpeed, floatingLabel, labelClasses, rounded, size, variant, reset})

  // Lets the Label use this select's own settings (e.g. floatingLabel set on the Select)
  setContext('INPUT_LABEL', {
    get floatingLabel() { return floatingLabel },
    get variant() { return variant },
    get size() { return size },
    get animationSpeed() { return animationSpeed },
    get reset() { return reset },
  } satisfies INPUT_CONFIG)
</script>

{#snippet labelContent()}
  {#if typeof label == "string"}
    <Label for={props?.id ?? id} class={labelClasses}>{label}</Label>
  {/if}
  {#if typeof label == "function"}
    {@render label()}
  {/if}
{/snippet}

<div class={twMerge(inputContainerClass(C, true ), wrapperClasses)}>
  <!-- A floating label only applies to a string label; a Snippet is always rendered here -->
  {#if label && (!floatingLabel || typeof label !== "string")}
    {@render labelContent()}
  {/if}

  <div class="relative flex focus-within">
    <select {id} bind:value={value} {...props} class={inputClasses(C, props, "select")} aria-describedby={helperText ? `${id}-helper` : null}>
      {#if placeholder}<option value="" disabled>{placeholder}</option>{/if}
      <!-- If options is provided, it will be used; otherwise, children will be rendered. -->
      {#if options && options?.length}
        {#each options as d, i (i)}
          {#if d}
            <option
              value={d.value !== undefined && d.value !== null ? d.value : d.text}
              disabled={d?.disabled}
            >{d.text}</option>
          {/if}
        {/each}
      {:else if children}
        {@render children()}
      {/if}
    </select>
    {#if typeof label == "string" && floatingLabel}
      <Label for={id} class={labelClasses}>{label}</Label>
    {/if}
  </div>

  {#if helperText}
    <HelperText id={id + "-helper"}>
      {#if typeof helperText === "function"} {@render helperText()}
      {:else} {helperText} {/if}
    </HelperText>
  {/if}
</div>