<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
	import { generateToken } from "$lib/function"
	import { inputClasses, groupInputContainerClass } from "$lib/Form/form"
	import { twMerge } from "tailwind-merge"
  import { Label } from "$lib"

  interface Props {
    children?: Snippet,
    value?: unknown,
    wrapperClasses?: string,
    [key: string]: unknown
  }

  const CTX_FORM: any = getContext('FORM') ?? {}
  const CTX_FSET: any = getContext('FIELDSET') ?? {}

  let {
    children,
    value = null,
    size = CTX_FSET?.size ?? CTX_FORM?.size ?? "md",
    animationSpeed = CTX_FSET?.animationSpeed ?? CTX_FORM?.animationSpeed ?? "normal",
    reset = CTX_FSET?.reset ?? CTX_FORM?.reset ?? false,
    labelClasses  = CTX_FSET?.labelClasses ?? CTX_FORM?.labelClasses ?? "",
    wrapperClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()
  
  const id: string = props?.id as string ?? generateToken()
  let C:INPUT_CONFIG & {type: "group"} = {animationSpeed, labelClasses, size, reset, type: "group"}
</script>

<div class={twMerge(groupInputContainerClass(C, {props}), wrapperClasses)}
  class:flex-row-reverse={props?.reverse}
  class:justify-end={props?.reverse}
>
  <input {id} {...props} class={inputClasses(C, props, "radio")} type="radio" aria-disabled={props?.disabled as boolean|undefined} bind:group={value} aria-checked={value === props?.value}>
  {#if children}
    <Label for={id} class="cursor-pointer {labelClasses??""}">
      {@render children()}
    </Label>
  {/if}
</div>