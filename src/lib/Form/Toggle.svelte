<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { animationClass, generateToken, roundedClass } from "$lib/function"
	import { getContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"
	import { getToggleSize, groupInputContainerClass } from "./form"
	import { Label } from "$lib";

  interface Props {
    children: Snippet,
    type?: "checkbox" | "radio",
    value?: unknown,
    wrapperClasses?: string,
    [key: string]: unknown
  }

  const CTX_FORM: any = getContext('FORM') ?? {}
  const CTX_FSET: any = getContext('FIELDSET') ?? {}

  let {
    children,
    type = "checkbox",
    value,
    size = CTX_FSET?.size ?? CTX_FORM?.size ?? "md",
    animate = CTX_FSET?.animate ?? CTX_FORM?.animate ?? "normal",
    labelClasses = CTX_FSET?.labelClasses ?? CTX_FORM?.labelClasses ?? "",
    rounded = "full",
    wrapperClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()
  
  let classes: string = `border-0 bg-gray-300 dark:bg-gray-600 checked:bg-brand-primary-500 dark:checked:bg-brand-primary-500 appearance-none relative flex items-center text-brand-primary-500 focus:!ring-gray-500 checked:focus:!ring-brand-primary-500 ${getToggleSize(size)} rtl:checked:after:-translate-x-full ${roundedClass(rounded)} ${animationClass(animate)} after:bg-white checked:bg-none ${roundedClass(rounded, "all", "after")} ${animationClass(animate, "all", "after")}`
  let setType: any = (node: HTMLInputElement) => node.type = type
  
  const id = generateToken()
  let C:INPUT_CONFIG & {id: string, type: "group"} = {animate, labelClasses, rounded, size, id, type: "group"}
</script>

<div class={twMerge("flex items-center gap-2", groupInputContainerClass(C, {props}), wrapperClasses)}>
	<input {id} {...props} {value} use:setType class="{twMerge(classes, props?.class as string)} cursor-pointer" />
  {#if children}
    <Label for={props?.id ?? id} class="cursor-pointer font-bold {labelClasses??""}">
      {@render children()}
    </Label>
  {/if}
</div>