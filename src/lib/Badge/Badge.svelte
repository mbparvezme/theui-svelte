<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge"
  import type { ROUNDED } from "$lib/types"
  import { roundedClass } from "$lib/function"

  interface Props {
    children ?: Snippet,
    ariaTitle ?: string,
    rounded ?: ROUNDED,
    // Takes the font size of the text around it instead of a fixed small size
    grow ?: boolean,
    // Sits on the corner of the element it is placed in, for a count on an icon or an avatar
    fixed ?: boolean,
    [key: string]: unknown // class, id, data-*
	}

  let {
    children,
    ariaTitle,
    rounded = "full",
    grow = false,
    fixed = false,
    ...props
  } : Props = $props()

  const badgeClasses = $derived(() => {
    let cls = `theui-badge
      ${twMerge(
        "items-center justify-center whitespace-nowrap select-none bg-brand-500 text-on-brand inline-block font-medium p-[.35em]",
        !grow ? "text-xs !leading-[.8em]" : "text-[1em] leading-[1em]",
        fixed ? "absolute transform translate-x-1/2 rtl:-translate-x-1/2 -translate-y-1/2 top-0 end-0 border-4 border-primary" : "",
        roundedClass(rounded),
        (props?.class ?? "") as string
      )}`
    return cls.trim()
  })
</script>

<!-- No default aria-label: a label would replace the content, so `<Badge>New</Badge>`
     would be read as "Badge". Set ariaTitle to name a badge that shows no text. -->
<span role="status" aria-label={ariaTitle} {...props} class={badgeClasses()}>
  {@render children?.()}
</span>