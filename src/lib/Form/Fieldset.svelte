<script lang="ts">
	import { getContext, setContext, type Snippet } from "svelte"
  import type { INPUT_CONFIG } from "$lib/types"
	import { generateToken } from "$lib/function";

  interface Props {
    children : Snippet,
    title ?: string,
    [key: string] : unknown
  }

  const CTX: any = getContext('FORM') ?? {}

  let {
    children,
    title,
    animationSpeed = CTX?.animationSpeed ?? "normal",
    variant = CTX?.variant ?? "bordered",
    floatingLabel = CTX?.floatingLabel ?? CTX?.variant == "flat" ?? false,
    labelClasses = CTX?.labelClasses ?? "",
    rounded = CTX?.rounded ?? "md",
    size = CTX?.size ?? "md",
    reset = CTX?.reset ?? false,
    ...props
  } : Props & Exclude<INPUT_CONFIG, "inputGrow"> = $props()

  let id: string = props?.id as string ?? generateToken()
  setContext('FIELDSET', {animationSpeed, size, floatingLabel, labelClasses, rounded, variant, reset})
</script>

<fieldset {...props} {id} class={props?.class as string}>
	<legend class="sr-only">{title}</legend>
  {@render children?.()}
</fieldset>