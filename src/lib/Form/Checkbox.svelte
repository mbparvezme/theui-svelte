<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
  import { generateToken } from "$lib/function"
  import { inputClasses, groupInputContainerClass } from "./form"
	import { twMerge } from "tailwind-merge"
  import { Label } from "$lib"

  interface Props {
    children?: Snippet,
    wrapperClasses?: string,
    [key: string]: unknown
  }
 
  const CTX_FORM: any = getContext('FORM') ?? {}
  const CTX_FSET: any = getContext('FIELDSET') ?? {}

  let {
    children,
    size            = CTX_FSET?.size ?? CTX_FORM?.size ?? "md",
    animationSpeed  = CTX_FSET?.animationSpeed ?? CTX_FORM?.animationSpeed ?? "normal",
    rounded         = CTX_FSET?.rounded ?? CTX_FORM?.rounded ?? "md",
    reset           = CTX_FSET?.reset ?? CTX_FORM?.reset ?? false,
    labelClasses    = CTX_FSET?.labelClasses ?? CTX_FORM?.labelClasses ?? "",
    wrapperClasses  = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const id = generateToken()
  let isChecked = $state(!!props?.checked)
  let C:INPUT_CONFIG & {type: "group"} = {animationSpeed, labelClasses, rounded, size, reset, type: "group"}
</script>

<div class={twMerge(groupInputContainerClass(C, {props}), wrapperClasses)}
  class:flex-row-reverse={props?.reverse}
  class:justify-end={props?.reverse}
>
  <input {id} {...props} class={inputClasses(C, props, "checkbox")} type="checkbox" aria-required={props?.required as boolean|undefined} aria-disabled={props?.disabled as boolean|undefined} aria-checked={isChecked} bind:checked={isChecked}>
  {#if children}
    <Label for={props?.id ?? id} class="cursor-pointer {labelClasses??""}">
      {@render children()}
    </Label>
  {/if}
</div>