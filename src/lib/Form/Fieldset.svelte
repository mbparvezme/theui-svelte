<script lang="ts">
	import { getContext, setContext, type Snippet } from "svelte"
  import type { INPUT_CONFIG } from "$lib/types"
	import { generateToken, coreSpeed, coreReset } from "$lib/function"

  type Props = {
    children: Snippet,
    title?: string,
    [key: string] : unknown
  } & Omit<INPUT_CONFIG, 'inputGrow'>

  const CTX: INPUT_CONFIG = getContext('FORM') ?? {}

  let {
    children,
    title,
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    variant = CTX?.variant ?? "bordered",
    // Own variant differs from the Form's: follow it; otherwise use the Form's floatingLabel
    floatingLabel = variant !== CTX?.variant ? variant === "flat" : (CTX?.floatingLabel ?? variant === "flat"),
    labelClasses = CTX?.labelClasses ?? "",
    rounded = CTX?.rounded ?? "md",
    size = CTX?.size ?? "md",
    reset = CTX?.reset ?? coreReset(),
    ...props
  } : Props = $props()

  const id = $derived((props.id as string | undefined) ?? generateToken())
  // Set during init so child inputs can read it; getters keep them in sync when props change
  const FIELDSET_CTX: INPUT_CONFIG = {
    get animationSpeed() { return animationSpeed },
    get size() { return size },
    get floatingLabel() { return floatingLabel },
    get labelClasses() { return labelClasses },
    get rounded() { return rounded },
    get variant() { return variant },
    get reset() { return reset },
  }
  setContext('FIELDSET', FIELDSET_CTX)
</script>

<fieldset {...props} {id} class={props?.class as string}>
  {#if title}
	  <legend class="sr-only">{title}</legend>
  {/if}
  {@render children()}
</fieldset>
