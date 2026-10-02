<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { animationClass, generateToken, roundedClass, coreSpeed, coreReset } from "$lib/function"
	import { getContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"
	import { groupInputContainerClass, getToggleSize, theuiInputClass } from "$lib/Form/form"
	import { Label } from "$lib"

  interface Props {
    children: Snippet,
    type?: "checkbox" | "radio",
    group?: unknown,
    value?: unknown,
    wrapperClasses?: string,
    checked?: boolean,
    labelPosition?: "start" | "end",
    [key: string]: unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    type = "checkbox",
    group = $bindable(),
    value,
    size = CTX?.size ?? "md",
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    labelClasses = CTX?.labelClasses ?? "",
    reset = CTX?.reset ?? coreReset(),
    rounded = "full",
    wrapperClasses = "",
    checked = $bindable(false),
    labelPosition = "end",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const id = $derived((props.id as string | undefined) ?? generateToken())
  // With `reset` only the marker class and the classes you pass are kept
  let classes: string = $derived(reset
    ? twMerge(`theui-toggle ${theuiInputClass["size"][size]}`, props?.class as string)
    : twMerge(`border-0 bg-gray-300 dark:bg-gray-600 checked:bg-brand-500 appearance-none relative flex items-center text-brand-500 ring-transparent focus:ring-brand-500 ring-offset-1 ${getToggleSize(size)} rtl:checked:after:-translate-x-full ${roundedClass(rounded)} ${animationClass(animationSpeed)} after:bg-white checked:bg-none ${roundedClass(rounded, "all", "after")} ${animationClass(animationSpeed, "all", "after")}`, props?.class as string, "cursor-pointer"))
  let C:INPUT_CONFIG & {type: "group"} = $derived({animationSpeed, labelClasses, reset, rounded, size, type: "group"})
</script>

<div class={twMerge(groupInputContainerClass(C, props), wrapperClasses)}
  class:flex-row-reverse={labelPosition === "start"}
  class:justify-end={labelPosition === "start"}
>
  {#if type == "checkbox"}
	  <input {id} {value} {...props} type="checkbox" class={classes} role="switch" aria-checked={checked} aria-disabled={props?.disabled as boolean | undefined} aria-required={props?.required as boolean | undefined} bind:checked={checked} />
  {/if}
  {#if type == "radio"}
	  <input {id} {value} {...props} type="radio" class={classes} role="switch" aria-checked={group !== undefined ? group === value : undefined} aria-disabled={props?.disabled as boolean | undefined} aria-required={props?.required as boolean | undefined} bind:group={group} />
  {/if}
  {#if children}
    <Label for={id} class="cursor-pointer {labelClasses}">
      {@render children()}
    </Label>
  {/if}
</div>
