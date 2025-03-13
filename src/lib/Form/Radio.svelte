<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses, groupInputContainerClass } from "./form"
  import { HelperText } from "$lib"
	import { twMerge } from "tailwind-merge";

  interface Props {
    label: string|Snippet,
    name: string,
    id?: string,
    value?: string | number | null | undefined | boolean,
    wrapperClasses?: string,
    [key: string]: unknown
  }

  const CTX: any = getContext('FORM') ?? {}

  let {
    label,
    name,
    id = generateToken(),
    value = null,
    size = CTX?.size ?? "md",
    animate = CTX?.animate ?? "normal",
    labelClasses  = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    rounded = CTX?.rounded ?? "md",
    reset = CTX?.reset ?? false,
    ...props
  }: Props & INPUT_CONFIG = $props()

  let C:INPUT_CONFIG & {id: string, type: "group"} = {animate, labelClasses, rounded, size, reset, id, type: "group"}
</script>

<div class={twMerge(groupInputContainerClass(C, {props}), wrapperClasses)}
  class:flex-row-reverse={props?.reverse}
  class:justify-end={props?.reverse}
>
  <input {...props} class={inputClasses(C, props, "checkbox")} {id} {name} type="radio" bind:group={value}>
  {#if label}
    <label for={id} class={twMerge("cursor-pointer", labelClasses)}>
      {#if typeof label == "string"} {@html label} {/if}
      {#if typeof label == "function"} {@render label()} {/if}
    </label>
  {/if}
</div>