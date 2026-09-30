<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
	import { generateToken, coreSpeed, coreReset } from "$lib/function"
	import { inputClasses, groupInputContainerClass } from "$lib/Form/form"
	import { twMerge } from "tailwind-merge"
  import { Label } from "$lib"

  interface Props {
    children?: Snippet,
    group?: unknown,
    value?: unknown,
    wrapperClasses?: string,
    labelPosition?: "start" | "end",
    [key: string]: unknown
  }
  
  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}
  
  let {
    children,
    group = $bindable(),
    value,
    size = CTX?.size ?? "md",
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    reset = CTX?.reset ?? coreReset(),
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    labelPosition = "end",
    ...props
  }: Props & INPUT_CONFIG = $props()
  
  const id = $derived((props.id as string | undefined) ?? generateToken())
  let C:INPUT_CONFIG & {type: "group"} = $derived({animationSpeed, labelClasses, size, reset, type: "group"})
</script>

<div class={twMerge(groupInputContainerClass(C, props), wrapperClasses)}
  class:flex-row-reverse={labelPosition === "start"}
  class:justify-end={labelPosition === "start"}
>
  <input {id} {value} {...props} class={inputClasses(C, props, "radio")} type="radio" aria-disabled={props?.disabled as boolean | undefined} bind:group={group} aria-checked={group !== undefined ? group === value : undefined}>
  {#if children}
    <Label for={id} class="cursor-pointer {labelClasses}">
      {@render children()}
    </Label>
  {/if}
</div>