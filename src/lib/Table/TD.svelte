<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  type SizeVariants = "compact" | "comfortable" | "default"

  const  CTX: any = getContext("TABLE")
  let {children, ...props} : {children ?: Snippet, [key : string] : unknown} = $props()

  const sizeClasses: Record<SizeVariants, string> = {
    compact: "px-2 py-1",
    default: "px-3 py-2",
    comfortable: "px-4 py-3",
  }

  let getCellClass = () => {
    const borderClass = (CTX?.border === "both" || CTX?.border === "x") ? `${CTX?.borderColor} border-l border-r` : "";
    const sizeClass = sizeClasses[CTX.space as SizeVariants ?? "default"];
    const textClass = "text-gray-600 dark:text-gray-400 font-normal";
    return twMerge(borderClass, sizeClass, textClass, CTX?.tdClasses, props?.class as string);
  }
</script>

<td {...props} class={getCellClass()}>
  {@render children?.()}
</td>