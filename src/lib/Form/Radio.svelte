<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
	import { generateToken } from "$lib/function"
	import { inputClasses, groupInputContainerClass } from "./form"
	import { twMerge } from "tailwind-merge";

  interface Props {
    name: string,
    children?: Snippet,
    id?: string,
    value?: unknown,
    wrapperClasses?: string,
    [key: string]: unknown
  }

  const CTX: any = getContext('FORM') ?? {}

  let {
    name,
    children,
    id = generateToken(),
    value = null,
    size = CTX?.size ?? "md",
    animate = CTX?.animate ?? "normal",
    reset = CTX?.reset ?? false,
    labelClasses  = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  let C:INPUT_CONFIG & {id: string, type: "group"} = {animate, labelClasses, size, reset, id, type: "group"}
</script>

<div class={twMerge(groupInputContainerClass(C, {props}), wrapperClasses)}
  class:flex-row-reverse={props?.reverse}
  class:justify-end={props?.reverse}
>
  <input {...props} class={inputClasses(C, props, "radio")} {id} {name} type="radio">
  {#if children}
    <label for={id} class={twMerge("cursor-pointer", labelClasses)}>
      {@render children()}
    </label>
  {/if}
</div>