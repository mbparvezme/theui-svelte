<script lang="ts">
  import type { INPUT_CONFIG, INPUT_TYPE, SELECT_DATA } from "$lib/types"
  import { getContext, setContext, type Snippet } from "svelte"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses } from "./form"
  import { Label, HelperText } from "$lib"
	import { twMerge } from "tailwind-merge"

  const CTX: INPUT_CONFIG = getContext('FORM') ?? {}

  interface Props {
    name: string,
    options?: SELECT_DATA[]|Snippet,
    label?: Snippet|string|undefined,
    helperText?: Snippet|string|undefined,
    type?: INPUT_TYPE,
    value?: string,
    wrapperClasses?: string,
    [key: string] : unknown
  }

  let {
    options = [],
    helperText = undefined,
    label = undefined,
    name = "",
    type = "text",
    value = "",

    animationSpeed = CTX?.animationSpeed ?? "normal",
    floatingLabel = CTX?.floatingLabel ?? CTX?.variant == "flat" ?? false,
    labelClasses = CTX?.labelClasses ?? "",
    rounded = CTX?.rounded ?? "md",
    size = CTX?.size ?? "md",
    variant = CTX?.variant ?? "bordered",
    reset = CTX?.reset ?? false,
    wrapperClasses = "",
    ...props
  } : Props & INPUT_CONFIG = $props()

  const id = generateToken()
  let C:INPUT_CONFIG & {type: "input"} = {animationSpeed, floatingLabel, labelClasses, rounded, size, variant, reset, type: "input"}
  setContext('FORM', C)
</script>

{#snippet labelContent()}
  {#if typeof label == "string"}
    <Label {id}>{label}</Label>
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
    <select {id} {name} bind:value={value} {...props} class={inputClasses(C, props, "select")}>
      {#if props?.placeholder}<option value>{props.placeholder}</option>{/if}
      {#if options}
        {#if typeof options == "function"}
          {@render options()}
        {:else if options.length}
          {#each options as d}
            {#if d}<option value={d.value ?? d.text} selected={d?.selected}>{d.text}</option>{/if}
          {/each}
        {/if}
      {/if}
    </select>
    {#if label && floatingLabel}
      {@render labelContent()}
    {/if}
  </div>

  {#if helperText}
    <HelperText>
      {#if typeof helperText === "function"} {@render helperText()}
      {:else} {@html helperText} {/if}
    </HelperText>
  {/if}
</div>