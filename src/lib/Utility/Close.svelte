<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge"
	import { Svg } from "$lib"

  interface Props {children?: Snippet, size?: number, ariaLabel?: string, onclick: any, [key: string]: unknown}
  let {children, size = 1.5, ariaLabel = "Close button", onclick, ...props} : Props = $props()
</script>

<button class="theui-close {twMerge("opacity-60 dark:opacity-50 hover:opacity-100 transition-opacity", props?.class as string)}" aria-label={ariaLabel} tabindex="-1" {onclick}>
  <span class="sr-only">{ariaLabel}</span>
  {#if children}
    {@render children()}
  {:else}
    <Svg {size}>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </Svg>
  {/if}
</button>