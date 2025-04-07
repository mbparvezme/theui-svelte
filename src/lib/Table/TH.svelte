<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  type SizeVariants = "compact" | "comfortable" | "default"

  const  CTX: any = getContext("TABLE")
  let {children, ...props} : {children ?: Snippet, [key : string] : unknown} = $props()

  const sizeClasses: Record<SizeVariants, string> = {
    compact: "p-2",
    default: "p-3",
    comfortable: "p-4",
  }

  let getCellClass = () => {
    const borderClass = (CTX?.border === "both" || CTX?.border === "x") ? `${CTX?.borderColor} border-l border-r` : "";
    const sizeClass = sizeClasses[CTX.space as SizeVariants ?? "default"];
    const textClass = "font-bold text-sm";
    return twMerge(borderClass, sizeClass, textClass, CTX?.thClasses, props?.class as string);
  }
</script>

<th {...props} class={getCellClass()}>
  {@render children?.()}
</th>