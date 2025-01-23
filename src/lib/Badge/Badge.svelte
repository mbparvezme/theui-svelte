<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { roundedClass } from "$lib/function"

  interface Props {
    children ?: Snippet,
    ariaTitle ?: string | undefined,
    rounded ?: ROUNDED,
    [key: string]: unknown // dismissible, icon
	}

  let {
    children,
    ariaTitle,
    rounded = "full",
    ...props
  } : Props = $props()

  const processClasses = () => {
    let cls = `
      items-center justify-center whitespace-nowrap select-none bg-brand-primary-500 text-on-brand-primary-500 inline-block font-medium p-[.35em]
      ${!props?.grow ? "text-xs !leading-[.8em]" : "text-[1em] leading-[1em]"} 
      ${props?.fixed ? "absolute transform translate-x-1/2 rtl:-translate-x-1/2 -translate-y-1/2 top-0 end-0 border-4 border-primary" : ""}
      ${roundedClass(rounded)}
    `;
    return cls.trim();
  }
</script>

<span class="theui-badge {twMerge(processClasses(), (props?.class ?? "") as string)}" aria-label={ariaTitle??"Badge"} role="status">
  {@render children?.()}
</span>