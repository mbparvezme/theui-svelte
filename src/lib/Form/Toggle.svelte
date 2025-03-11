<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { generateToken, roundedClass } from "$lib/function"
	import { getContext, onMount, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"

  interface Props {
    helperText?: string | Snippet,
    id?: string,
    label?: string|Snippet,
    name: string,
    type?: "checkbox" | "radio",
    value?: boolean | string,
    [key: string]: unknown
  }

  const CTX: any = getContext('FORM') ?? {}

  let {
    helperText,
    label,
    name,
    id = generateToken(),
    value,
    animate = CTX?.animate ?? "normal",
    labelClasses  = CTX?.labelClasses ?? "",
    rounded = CTX?.rounded ?? "full",
    size = CTX?.size ?? "md",
    type = "checkbox",
    ...props
  }: Props & INPUT_CONFIG = $props()

  let classes: string = `h-5 w-9 border-0 bg-gray-300 dark:bg-gray-600 checked:bg-brand-primary-500 dark:checked:bg-brand-primary-500 appearance-none relative flex items-center px-1 ease-in-out duration-300 text-brand-primary-500 focus:!ring-gray-500 checked:focus:!ring-brand-primary-500 mt-[6px] ${roundedClass(rounded)} ${rounded ? 'after:rounded-full' : 'after:rounded-sm'} after:w-3 after:h-3 after:bg-white after:transition-all after:ease-in-out after:duration-300 checked:bg-none checked:after:translate-x-[14px] rtl:checked:after:-translate-x-[14px]`
  let setType: any = (node: HTMLInputElement) => {
    node.type = type
    if(type == "checkbox" && value)
    node.checked = true
  }
</script>

<div class="flex items-start gap-2 cursor-pointer">
	<input {...props} {id} {name} {value} use:setType class={twMerge(classes, props?.class as string)} />
  {#if label}
    <label for={id} class="flex flex-col gap-1">
      {#if typeof label == "string"} {@html label} {/if}
      {#if typeof label == "function"} {@render label()} {/if}
      {#if helperText}
        {#if typeof helperText == "string"} {@html helperText} {/if}
        {#if typeof helperText == "function"} {@render helperText()} {/if} {value}
      {/if}
    </label>
  {/if}
</div>