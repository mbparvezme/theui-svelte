<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { animationClass, generateToken, roundedClass } from "$lib/function"
	import { getContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"
	import { getToggleSize, groupInputContainerClass } from "./form"

  interface Props {
    children: Snippet,
    name: string,
    id?: string,
    type?: "checkbox" | "radio",
    value?: unknown,
    wrapperClasses?: string,
    [key: string]: unknown
  }

  const CTX: any = getContext('FORM') ?? {}

  let {
    children,
    name,
    id = generateToken(),
    type = "checkbox",
    value,
    size = CTX?.size ?? "md",
    animate = CTX?.animate ?? "normal",
    rounded = "full",
    wrapperClasses = "",
    labelClasses = CTX?.labelClasses ?? "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  let classes: string = `border-0 bg-gray-300 dark:bg-gray-600 checked:bg-brand-primary-500 dark:checked:bg-brand-primary-500 appearance-none relative flex items-center text-brand-primary-500 focus:!ring-gray-500 checked:focus:!ring-brand-primary-500 ${getToggleSize(size)} rtl:checked:after:-translate-x-full ${roundedClass(rounded)} ${animationClass(animate)} after:bg-white checked:bg-none ${roundedClass(rounded, "all", "after")} ${animationClass(animate, "all", "after")}`
  let setType: any = (node: HTMLInputElement) => node.type = type

  let C:INPUT_CONFIG & {id: string, type: "group"} = {animate, labelClasses, rounded, size, id, type: "group"}
</script>

<div class={twMerge("flex items-center gap-2", groupInputContainerClass(C, {props}), wrapperClasses)}>
	<input {...props} {id} {name} {value} use:setType class="{twMerge(classes, props?.class as string)} cursor-pointer" />
  {#if children}
    <label for={id} class={twMerge("cursor-pointer", labelClasses)}>
      {@render children()}
    </label>
  {/if}
</div>