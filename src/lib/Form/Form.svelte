<script lang="ts">
	import { setContext, type Snippet } from "svelte"
  import type { Action } from 'svelte/action'
  import type { INPUT_CONFIG, ANIMATE_SPEED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { coreSpeed, coreReset } from "$lib/function"

  type Props = {
      children: Snippet,
      method?: 'GET' | 'POST',
      animationSpeed?: ANIMATE_SPEED,
      enhance?: Action<HTMLFormElement>,
      [key: string]: unknown
  } & Omit<INPUT_CONFIG, 'inputGrow'>

  const noopAction: Action<HTMLFormElement> = () => ({ destroy() {} })

  let {
    children,
    method = "POST",
    animationSpeed = coreSpeed(),
    variant = "bordered",
    floatingLabel = variant === "flat",
    labelClasses = undefined,
    rounded = "md",
    size = "md",
    reset = coreReset(),
    enhance: enhanceAction = noopAction,
    ...props
  } : Props = $props()

  // Set during init so child inputs can read it; getters keep them in sync when props change
  const FORM_CTX: INPUT_CONFIG = {
    get animationSpeed() { return animationSpeed },
    get size() { return size },
    get floatingLabel() { return floatingLabel },
    get labelClasses() { return labelClasses },
    get rounded() { return rounded },
    get variant() { return variant },
    get reset() { return reset },
  }
  setContext('FORM', FORM_CTX)
</script>

<form {...props} {method} class={twMerge("flex flex-col gap-4", props?.class as string)} use:enhanceAction>
  {@render children()}
</form>
