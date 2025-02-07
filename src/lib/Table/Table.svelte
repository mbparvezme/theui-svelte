<script lang="ts">
	import { setContext, type Snippet } from "svelte"
  import type { ANIMATE_SPEED, TABLE_ROW } from "$lib/types"
  import { generateToken, animationClass } from "$lib/function"
  import { twMerge } from "tailwind-merge"
  import { THead, TBody } from "$lib"

  interface Props {
    head          ?: Snippet,
    children      ?: Snippet,
    headers       ?: string[]|Record<string, unknown>,
    data          ?: TABLE_ROW,
    keys          ?: string[],
    id            ?: string,
    animate       ?: ANIMATE_SPEED,
    border        ?: 'x' | 'y' | 'both' | 'none',
    borderColor   ?: string,
    hover         ?: boolean | string,
    space         ?: 'compact' | 'default' | 'comfortable',
    stripe        ?: boolean | string,
    trClasses     ?: string,
    trHeadClasses ?: string,
    tdClasses     ?: string,
    [key: string] : unknown
  }

  let {
    head,
    children,
    headers,
    data,
    keys,
    id = generateToken(),
    animate = "normal",
    border = "both",
    borderColor = "border-gray-200/80 dark:border-gray-800/80",
    hover = false,
    space = "default",
    stripe = false,
    trClasses = "",
    trHeadClasses = "",
    tdClasses = "",
    ...props
  } : Props = $props()

  let rowClasses = () => {
    const borderClasses = border === "both" || border === "y" ? `border-y ${borderColor}` : borderColor || "";
    const hoverClasses = hover ? `${animationClass(animate)} hover:bg-gray-200 dark:hover:bg-gray-800` : "";
    const stripeClasses =
      stripe === true || stripe === "true" || props?.stripe
        ? `even:bg-gray-100 dark:even:bg-gray-900 ${borderColor}`
        : typeof stripe === "string" && stripe !== "true"
        ? stripe
        : "";
    return twMerge(borderClasses, hoverClasses, stripeClasses, trClasses);
  }

  let headerRowClasses = () => {
    let trClasses = rowClasses().replace("border-y ", "")
      .replace("hover:bg-gray-200 dark:hover:bg-gray-800", "")
      .replace(new RegExp(animationClass(animate).replace(/\s+/g, '\\s+'), 'g'), "")
    return twMerge(trClasses, trHeadClasses)
  }

  setContext('TABLE', {
    animate,
    border,
    borderColor,
    hover,
    space,
    stripe,
    trHeadClasses : headerRowClasses(),
    trClasses : rowClasses(),
    tdClasses,
  })

  let cls = `theui-table w-full text-start border-collapse ${border=="x" ? `border-x ${borderColor}` : ""}`
</script>

<div class="table-container w-full overflow-x-auto">
  <table {id} {...props} class={twMerge(cls, props?.class as string)}>

    {#if headers && (Object.prototype.toString.call(headers) === "[object Object]" || Array.isArray(headers))}
      <THead {headers} {keys} />
    {/if}

    {#if data}
      <TBody {data} {keys}/>
    {/if}

    {@render children?.()}

  </table>
</div>