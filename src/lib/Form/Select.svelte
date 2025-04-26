<script lang="ts">
  import type { INPUT_CONFIG, SELECT_DATA } from "$lib/types"
  import { getContext, setContext, type Snippet } from "svelte"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses } from "$lib/Form/form"
  import { Label, HelperText } from "$lib"
	import { twMerge } from "tailwind-merge"

  const CTX: INPUT_CONFIG = getContext('FORM') ?? {}

  interface Props {
    children?: Snippet,
    options?: SELECT_DATA[],
    value?: string,
    label?: Snippet|string,
    helperText?: Snippet|string,
    labelClasses?: string,
    wrapperClasses?: string,
    [key: string] : unknown
  }

  let {
    children,
    options,
    value,
    variant = CTX?.variant ?? "bordered",
    label,
    floatingLabel = CTX?.floatingLabel ?? CTX?.variant == "flat" ?? false,
    size = CTX?.size ?? "md",
    rounded = CTX?.rounded ?? "md",
    animationSpeed = CTX?.animationSpeed ?? "normal",
    helperText,
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    reset = CTX?.reset ?? false,
    ...props
  } : Props & INPUT_CONFIG = $props()

  const id: string = props?.id as string ?? generateToken()
  let C:INPUT_CONFIG = {animationSpeed, floatingLabel, labelClasses, rounded, size, variant, reset}
  setContext('FORM', C)
</script>

{#snippet labelContent()}
  {#if typeof label == "string"}
    <Label for={props?.id ?? id} class={labelClasses}>{label}</Label>
  {/if}
  {#if typeof label == "function"}
    {@render label?.()}
  {/if}
{/snippet}

<div class={twMerge(inputContainerClass(C, true ), wrapperClasses)}>
  {#if label && !floatingLabel}
    {@render labelContent()}
  {/if}

  <div class="relative flex focus-within">
    <select {id} bind:value={value} {...props} class={inputClasses(C, props, "select")} aria-describedby={helperText ? `${id}-helper` : null}>
      {#if props?.placeholder !== false}<option value="" disabled>{String(props?.placeholder??"-- Select --")}</option>{/if}
      <!-- If options is provided, it will be used; otherwise, children will be rendered. -->
      {#if options && options.length}
        {#each options as d}
          {#if d}<option value={d.value ?? d.text} disabled={d?.disabled}>{d.text}</option>{/if}
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
      {:else} {@html helperText} {/if}
    </HelperText>
  {/if}
</div>