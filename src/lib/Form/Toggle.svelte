<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { animationClass, generateToken, roundedClass } from "$lib/function"
	import { getContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"
	import { groupInputContainerClass } from "$lib/Form/form"
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

  const toggleSizes: Record<Exclude<INPUT_CONFIG['size'], undefined>, string> = {
    sm: "h-4 w-6 after:w-3 after:h-3 px-0.5 checked:after:translate-x-2",
    md: "h-5 w-8 after:w-3 after:h-3 px-1 checked:after:translate-x-3",
    lg: "h-6 w-10 after:w-4 after:h-4 px-1 checked:after:translate-x-4",
    xl: "h-7 w-12 after:w-5 after:h-5 px-1 checked:after:translate-x-5"
  }

  let classes: string = `border-0 bg-gray-300 dark:bg-gray-600 checked:bg-brand-primary-500 dark:checked:bg-brand-primary-500 appearance-none relative flex items-center text-brand-primary-500 focus:!ring-gray-500 checked:focus:!ring-brand-primary-500 ${toggleSizes[size]} rtl:checked:after:-translate-x-full ${roundedClass(rounded)} ${animationClass(animationSpeed)} after:bg-white checked:bg-none ${roundedClass(rounded, "all", "after")} ${animationClass(animationSpeed, "all", "after")}`

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