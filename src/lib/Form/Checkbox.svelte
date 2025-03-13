<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
  import { generateToken } from "$lib/function"
  import { inputClasses, groupInputContainerClass } from "./form"
	import { twMerge } from "tailwind-merge"

  interface Props {
    label: string|Snippet,
    name: string,
    id?: string,
    value?: boolean | null,
    wrapperClasses?: string,
    [key: string]: unknown
  }
 
  const CTX: any = getContext('FORM') ?? {}

  let {
    label,
    name,
    id            = generateToken(),
    value         = null,
    size          = CTX?.size ?? "md",
    animate       = CTX?.animate ?? "normal",
    rounded       = CTX?.rounded ?? "md",
    reset         = CTX?.reset ?? false,
    labelClasses  = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  let C:INPUT_CONFIG & {id: string, type: "group"} = {animate, labelClasses, rounded, size, reset, id, type: "group"}
</script>

<div class={twMerge(groupInputContainerClass(C, {props}), wrapperClasses)}
  class:flex-row-reverse={props?.reverse}
  class:justify-end={props?.reverse}
>
  <input {...props} class={inputClasses(C, props, "checkbox")} {id} {name} type="checkbox" bind:checked={value}>
  {#if label}
    <label for={id} class={twMerge("cursor-pointer", labelClasses)}>
      {#if typeof label == "string"} {@html label} {/if}
      {#if typeof label == "function"} {@render label()} {/if}
    </label>
  {/if}
</div>