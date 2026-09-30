<script lang="ts">
  import { setContext, untrack, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { AVATAR_GROUP_CTX, AVATAR_SIZE, ROUNDED } from "$lib/types"
  import { roundedClass } from "$lib/function"
  import { avatarClasses, groupClasses } from "./avatar"

  interface Props {
    children?: Snippet,
    max?: number,
    size?: AVATAR_SIZE,
    rounded?: ROUNDED,
    ariaLabel?: string,
    moreClasses?: string,
    [key: string]: unknown
  }

  let {
    children,
    max,
    size = "md",
    rounded = "full",
    ariaLabel,
    moreClasses = "",
    ...props
  }: Props = $props()

  let ids: string[] = $state([])

  const limit = $derived(max && max > 0 && ids.length > max ? max : ids.length)
  const hidden = $derived(ids.length - limit)

  setContext<AVATAR_GROUP_CTX>("AVATAR_GROUP", {
    add: (id) => untrack(() => { if (!ids.includes(id)) ids.push(id) }),
    remove: (id) => untrack(() => { ids = ids.filter(i => i !== id) }),
    shown: (id) => ids.indexOf(id) < limit,
    get size() { return size },
    get rounded() { return rounded },
  })
</script>

<div role="group" aria-label={ariaLabel} {...props} class={twMerge(groupClasses(), props?.class as string)}>
  {@render children?.()}
  {#if hidden > 0}
    <span class={twMerge(avatarClasses(size, true), roundedClass(rounded), moreClasses)} role="img" aria-label="{hidden} more">
      <span aria-hidden="true">+{hidden}</span>
    </span>
  {/if}
</div>
