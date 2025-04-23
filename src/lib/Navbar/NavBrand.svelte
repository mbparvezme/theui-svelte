<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"

  interface Props {children: Snippet, href: string, ariaLabel?: string, [key: string]: unknown}
  let {children, href = "/", ariaLabel = "Logo: click to to go homepage", ...props}: Props = $props()
</script>

{#if children}
  <a {href} class="navbar-brand {twMerge("flex items-center gap-4 h-full max-w-[180px] font-semibold text-default", props?.class as string)}" aria-label={ariaLabel}>
    {@render children()}
  </a>
{/if}