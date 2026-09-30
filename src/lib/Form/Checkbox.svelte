<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
  import { generateToken, coreSpeed, coreReset } from "$lib/function"
  import { inputClasses, groupInputContainerClass } from "$lib/Form/form"
	import { twMerge } from "tailwind-merge"
  import { Label } from "$lib"

  interface Props {
    children?: Snippet,
    wrapperClasses?: string,
    checked?: boolean,
    labelPosition?: "start" | "end",
    [key: string]: unknown
  }
 
  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    checked         = $bindable(false),
    size            = CTX?.size ?? "md",
    animationSpeed  = CTX?.animationSpeed ?? coreSpeed(),
    rounded         = CTX?.rounded ?? "sm",
    reset           = CTX?.reset ?? coreReset(),
    labelClasses    = CTX?.labelClasses ?? "",
    wrapperClasses  = "",
    labelPosition   = "end",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const id = $derived((props.id as string | undefined) ?? generateToken())
  let C:INPUT_CONFIG & {type: "group"} = $derived({animationSpeed, labelClasses, rounded, size, reset, type: "group"})
</script>

<div class={twMerge(groupInputContainerClass(C, props), wrapperClasses)}
  class:flex-row-reverse={labelPosition === "start"}
  class:justify-end={labelPosition === "start"}
>
  <input {id} {...props} class={inputClasses(C, props, "checkbox")} type="checkbox" aria-required={props?.required as boolean | undefined} aria-disabled={props?.disabled as boolean | undefined} bind:checked={checked}>
  {#if children}
    <Label for={id} class={labelClasses}>
      {@render children()}
    </Label>
  {/if}
</div>