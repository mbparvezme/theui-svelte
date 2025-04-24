<script lang="ts">
	import { setContext, type Snippet } from "svelte"
  import type { ANIMATE_SPEED, TABLE_ROW } from "$lib/types"
  import { generateToken, animationClass } from "$lib/function"
  import { twMerge, type ClassNameValue } from "tailwind-merge"
  import { THead, TBody } from "$lib"

  interface Props {
    children        ?: Snippet,
    headers         ?: string[] | Record<string, unknown>,
    data            ?: TABLE_ROW,
    keys            ?: string[],
    border          ?: 'x' | 'y' | 'both' | 'none',
    borderColor     ?: string,
    space           ?: 'compact' | 'default' | 'comfortable',
    stripe          ?: "even" | "odd" | ClassNameValue,
    hover           ?: true | ClassNameValue,
    trHeadClasses   ?: string,
    trClasses       ?: string,
    tdClasses       ?: string,
    animationSpeed  ?: ANIMATE_SPEED,
    id              ?: string,
    [key: string]   : unknown
  }

  let {
    children,
    headers,
    data,
    keys,
    border = "both",
    borderColor = "border-gray-200/80 dark:border-gray-800/80",
    space = "default",
    stripe,
    hover = false,
    trHeadClasses = "",
    trClasses = "",
    tdClasses = "",
    animationSpeed = "normal",
    id = generateToken(),
    ...props
  } : Props = $props()

  let stripeClasses = $state("")

  let rowClasses = () => {
    const borderClasses = border === "both" || border === "y" ? `border-y ${borderColor}` : borderColor || "";
    const hoverClasses = hover === true ? `${animationClass(animationSpeed)} hover:bg-gray-200 dark:hover:bg-gray-800`
      : (typeof hover === "string" ? `${hover}${animationClass(animationSpeed)}` : "");
    stripeClasses =
      stripe === "even" ? `even:bg-gray-100 dark:even:bg-gray-900 ${borderColor}` :
      stripe === "odd" ? `odd:bg-gray-100 dark:odd:bg-gray-900 ${borderColor}` :
      typeof stripe === "string" ? `${stripe} ${borderColor}` : "";
    return twMerge(borderClasses, hoverClasses, stripeClasses, trClasses);
  }

  let headerRowClasses = () => {
    let trClasses = rowClasses().replace("border-y ", "")
      .replace("hover:bg-gray-200 dark:hover:bg-gray-800", "")
      .replace(stripeClasses, "")
      .replace(new RegExp(animationClass(animationSpeed).replace(/\s+/g, '\\s+'), 'g'), "")
    return twMerge(trClasses, trHeadClasses)
  }

  setContext('TABLE', {
    animationSpeed,
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