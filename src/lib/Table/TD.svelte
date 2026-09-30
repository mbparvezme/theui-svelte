<script lang="ts">
	import type { TABLE_CONTEXT } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"

  const CTX = getContext<TABLE_CONTEXT>("TABLE")
  let {children, ...props} : {children ?: Snippet, [key : string] : unknown} = $props()

  const sizeClasses: Record<TABLE_CONTEXT['space'], string> = {
    compact: "px-2 py-1",
    default: "px-3 py-2",
    comfortable: "px-4 py-3",
  }

  let cellClass = $derived(
    twMerge(
      (CTX?.border === "both" || CTX?.border === "x") ? `${CTX.borderColor} border-l border-r` : "",
      sizeClasses[CTX?.space ?? "default"],
      "text-gray-600 dark:text-gray-400 font-normal",
      CTX?.tdClasses,
      props?.class as string
    )
  )
</script>

<td {...props} class={cellClass}>
  {@render children?.()}
</td>