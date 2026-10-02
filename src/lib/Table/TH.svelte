<script lang="ts">
	import type { TABLE_CONTEXT } from "$lib/types";
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"

  const CTX = getContext<TABLE_CONTEXT>("TABLE")
  // A header cell without a scope leaves screen readers guessing which cells it covers.
  // Column headers are by far the common case; pass scope="row" for a header that names its row.
  let {children, scope = "col", ...props} : {children ?: Snippet, scope ?: "col" | "row" | "colgroup" | "rowgroup", [key : string] : unknown} = $props()

  const sizeClasses: Record<TABLE_CONTEXT['space'], string> = {
    compact: "p-2",
    default: "p-3",
    comfortable: "p-4",
  }

  let cellClass = $derived(
    twMerge(
      (CTX?.border === "both" || CTX?.border === "x") ? `${CTX.borderColor} border-l border-r` : "",
      sizeClasses[CTX?.space ?? "default"],
      "font-bold text-sm",
      CTX?.thClasses,
      props?.class as string
    )
  )
</script>

<th {...props} {scope} class={cellClass}>
  {@render children?.()}
</th>
