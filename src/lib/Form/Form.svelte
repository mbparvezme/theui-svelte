<script lang="ts">
	import { setContext, type Snippet } from "svelte"
  import type { INPUT_CONFIG } from "$lib/types"
  import { twMerge } from "tailwind-merge"

  interface Props {
    children : Snippet,
    method ?: 'GET' | 'POST',
    [key: string] : unknown
  }

  let {
    children,
    method = "POST",
    animate = "normal",
    variant = "bordered",
    floatingLabel = variant == "flat",
    labelClasses = undefined,
    rounded = "md",
    size = "md",
    reset = false,
    ...props
  } : Props & Exclude<INPUT_CONFIG, "inputGrow"> = $props()

  setContext('FORM', {animate, size, floatingLabel, labelClasses, rounded, variant, reset})
</script>

<form {...props} {method} class={twMerge("flex flex-col gap-4", props?.class as string)}>
  {@render children?.()}
</form>