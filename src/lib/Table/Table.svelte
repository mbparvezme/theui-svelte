<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import type { ANIMATE_SPEED, TABLE_DATA, TABLE_CONTEXT } from "$lib/types"
  import { generateToken, animationClass, coreSpeed } from "$lib/function"
  import { twMerge, type ClassNameValue } from "tailwind-merge"
  import { THead, TBody } from "$lib"

  interface Props {
    children        ?: Snippet,
    headers         ?: string[] | Record<string, unknown>,
    data            ?: TABLE_DATA,
    keys            ?: string[],
    border          ?: 'x' | 'y' | 'both' | 'none',
    borderColor     ?: string,
    space           ?: 'compact' | 'default' | 'comfortable',
    stripe          ?: "even" | "odd" | ClassNameValue,
    hover           ?: true | ClassNameValue,
    trHeadClasses   ?: string,
    trClasses       ?: string,
    thClasses       ?: string,
    tdClasses       ?: string,
    animationSpeed  ?: ANIMATE_SPEED,
    ariaLabel       ?: string,
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
    thClasses = "",
    tdClasses = "",
    animationSpeed = coreSpeed(),
    ariaLabel,
    id = generateToken(),
    ...props
  } : Props = $props()

  // A table wider than the screen scrolls sideways. A plain overflow box cannot be reached
  // with the keyboard, so the part hanging off the edge would be out of reach. Making it a
  // named region with a tab stop fixes that, but only while it really does overflow.
  let scrollEl: HTMLElement | undefined = $state()
  let scrollable = $state(false)

  $effect(() => {
    const el = scrollEl
    if (!el || typeof ResizeObserver === "undefined") return
    const check = () => scrollable = el.scrollWidth > el.clientWidth
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    const table = el.querySelector("table")
    if (table) observer.observe(table)
    return () => observer.disconnect()
  })

  const stripeClasses = $derived(
    stripe === "even" ? `even:bg-gray-100 dark:even:bg-gray-900 ${borderColor}` :
    stripe === "odd" ? `odd:bg-gray-100 dark:odd:bg-gray-900 ${borderColor}` :
    typeof stripe === "string" ? `${stripe} ${borderColor}` : ""
  )

  const headRowClasses = $derived(twMerge(
    border === "both" || border === "x" ? `border-x ${borderColor}` : "",
    trHeadClasses
  ))

  const bodyRowClasses = $derived(twMerge(
    border === "both" || border === "y" ? `border-y ${borderColor}` : "",
    hover === true ? `${animationClass(animationSpeed)} hover:bg-gray-200 dark:hover:bg-gray-800` :
      typeof hover === "string" ? `${hover} ${animationClass(animationSpeed)}` : "",
    stripeClasses,
    trClasses
  ))

  // Getters, so a row reads each prop as it is now. Written as plain values the rows would
  // keep whatever the table happened to hold the moment it first ran.
  setContext<TABLE_CONTEXT>('TABLE', {
    get animationSpeed() { return animationSpeed },
    get border() { return border },
    get borderColor() { return borderColor },
    get hover() { return hover },
    get space() { return space },
    get stripe() { return stripe },
    get trHeadClasses() { return headRowClasses },
    get trClasses() { return bodyRowClasses },
    get thClasses() { return thClasses },
    get tdClasses() { return tdClasses },
  })

  let cls = $derived(`theui-table w-full text-start border-collapse ${border == "x" ? `border-x ${borderColor}` : ""}`)
</script>

<!-- A scrollable region needs a tab stop, or the keyboard cannot reach what is off screen -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div bind:this={scrollEl}
  class="table-container w-full overflow-x-auto"
  role={scrollable ? "region" : undefined}
  tabindex={scrollable ? 0 : undefined}
  aria-label={scrollable ? (ariaLabel ?? "Table") : undefined}>
  <table {id} {...props} aria-label={ariaLabel} class={twMerge(cls, props?.class as string)}>

    {#if headers && (typeof headers === "object" && headers !== null && !Array.isArray(headers) || Array.isArray(headers))}
      <THead {headers} {keys} />
    {/if}

    {#if data}
      <TBody {data} {keys}/>
    {/if}

    {@render children?.()}

  </table>
</div>