<script lang="ts">
  import { getContext, onDestroy, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { WIZARD_CTX } from "$lib/types"

  interface Props {
    children: Snippet,
    title?: string,
    description?: string,
    optional?: boolean,
    validate?: () => boolean | Promise<boolean>,
    [key: string]: unknown
  }

  let { children, title, description, optional = false, validate, ...props }: Props = $props()

  const CTX = getContext<WIZARD_CTX | undefined>("FORM_WIZARD")
  if (!CTX) throw new Error("[theui-svelte] FormStep must be used inside a FormWizard")

  const id = $props.id()

  CTX.add(id, {
    get title() { return title },
    get description() { return description },
    get optional() { return optional },
    get validate() { return validate },
  })
  onDestroy(() => CTX.remove(id))

  const state = $derived(CTX.step(id))
</script>

<!-- Every step stays in the page so its fields keep their values; only the active one is shown -->
<div
  data-wizard-step={id}
  hidden={!state.active}
  inert={!state.active}
  tabindex="-1"
  role="group"
  aria-label={title ?? `Step ${state.index + 1} of ${state.total}`}
  {...props}
  class={twMerge("theui-wizard-step flex flex-col gap-4 outline-none", CTX.stepClasses, props?.class as string)}
>
  {@render children()}
</div>
