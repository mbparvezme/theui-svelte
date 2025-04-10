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
    animationSpeed = CTX_FSET?.animationSpeed ?? CTX_FORM?.animationSpeed ?? "normal",
    labelClasses = CTX_FSET?.labelClasses ?? CTX_FORM?.labelClasses ?? "",
    rounded = "full",
    wrapperClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  let classes: string = `border-0 bg-gray-300 dark:bg-gray-600 checked:bg-brand-primary-500 dark:checked:bg-brand-primary-500 appearance-none relative flex items-center text-brand-primary-500 focus:!ring-gray-500 checked:focus:!ring-brand-primary-500 ${getToggleSize(size)} rtl:checked:after:-translate-x-full ${roundedClass(rounded)} ${animationClass(animationSpeed)} after:bg-white checked:bg-none ${roundedClass(rounded, "all", "after")} ${animationClass(animationSpeed, "all", "after")}`

  let isActive: boolean = $state(!!props?.checked)
  const id: string = props?.id as string ?? generateToken()
  let C:INPUT_CONFIG & {type: "group"} = {animationSpeed, labelClasses, rounded, size, type: "group"}
</script>

<div class={twMerge("flex items-center gap-2", groupInputContainerClass(C, {props}), wrapperClasses)}>
  {#if type == "checkbox"}
	  <input {id} {...props} {value} type="checkbox" class="{twMerge(classes, props?.class as string)} cursor-pointer" role="switch" aria-checked={isActive} bind:checked={isActive} />
  {/if}
  {#if type == "radio"}
	  <input {id} {...props} {value} type="radio" class="{twMerge(classes, props?.class as string)} cursor-pointer" role="switch" aria-checked={value === props?.value} bind:group={value} />
  {/if}
  {#if children}
    <Label for={id} class="cursor-pointer font-bold {labelClasses??""}">
      {@render children()}
    </Label>
  {/if}
</div>