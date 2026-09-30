<script lang="ts">
  import { getContext, onDestroy, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { AVATAR_GROUP_CTX, AVATAR_SIZE, AVATAR_STATUS, ROUNDED } from "$lib/types"
  import { roundedClass } from "$lib/function"
  import { Svg } from "$lib"
  import { avatarClasses, initials, statusClasses, STATUS_TEXT } from "./avatar"

  interface Props {
    children?: Snippet,
    src?: string,
    alt?: string,
    name?: string,
    size?: AVATAR_SIZE,
    rounded?: ROUNDED,
    status?: AVATAR_STATUS,
    statusPosition?: "top" | "bottom",
    href?: string,
    imgClasses?: string,
    statusClasses?: string,
    [key: string]: unknown
  }

  const GROUP = getContext<AVATAR_GROUP_CTX | undefined>("AVATAR_GROUP")

  let {
    children,
    src,
    alt,
    name,
    size,
    rounded,
    status,
    statusPosition = "bottom",
    href,
    imgClasses = "",
    statusClasses: statusCls = "",
    ...props
  }: Props = $props()

  const id = $props.id()
  GROUP?.add(id)
  onDestroy(() => GROUP?.remove(id))

  const shown = $derived(GROUP ? GROUP.shown(id) : true)
  const avatarSize = $derived(size ?? GROUP?.size ?? "md")
  const avatarRounded = $derived(rounded ?? GROUP?.rounded ?? "full")

  // Remember the src that failed, so a new src is tried again
  let failedSrc = $state<string>()
  const showImage = $derived(!!src && failedSrc !== src)
  const label = $derived(alt || name)
  const statusText = $derived(status ? STATUS_TEXT[status] : "")
</script>

{#if shown}
  <svelte:element
    this={href ? "a" : "span"}
    {href}
    {...props}
    class={twMerge(avatarClasses(avatarSize, !!GROUP), roundedClass(avatarRounded), props?.class as string)}
  >
    {#if showImage}
      <img {src} alt={alt ?? name ?? ""} class={twMerge("size-full object-cover", roundedClass(avatarRounded), imgClasses)} onerror={() => failedSrc = src} />
    {:else if children}
      <span class={twMerge("flex size-full items-center justify-center overflow-hidden", roundedClass(avatarRounded))}>
        {@render children()}
      </span>
    {:else if name}
      <span class={twMerge("flex size-full items-center justify-center overflow-hidden", roundedClass(avatarRounded))} role="img" aria-label={label}>
        <span aria-hidden="true">{initials(name)}</span>
      </span>
    {:else}
      <span class={twMerge("flex size-full items-end justify-center overflow-hidden", roundedClass(avatarRounded))} role="img" aria-label={alt || "Avatar"}>
        <Svg size={0} viewBox="0 0 16 16" class="size-4/5 translate-y-[12%] opacity-60">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          <path d="M2 15.5C2 12.5 4.7 10 8 10s6 2.5 6 5.5V16H2v-.5z"/>
        </Svg>
      </span>
    {/if}

    {#if status}
      <span class={twMerge(statusClasses(status, statusPosition, avatarRounded), statusCls)}>
        <span class="sr-only">{statusText}</span>
      </span>
    {/if}
  </svelte:element>
{/if}
