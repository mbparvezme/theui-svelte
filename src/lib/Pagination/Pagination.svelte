<script lang="ts">
  import type { ANIMATE_SPEED, BUTTON_SIZE, ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
	import { roundedClass } from "$lib/function"
  import { Button, ButtonGroup } from "$lib"

  interface Props {
    data ?: Array<{url: string, active?: boolean}>,
    activeButtonClasses ?: string,
    align ?: 'start' | 'center' | 'end',
    animate ?: ANIMATE_SPEED,
    buttonClasses ?: string,
    nextBtn ?: string,
    prevBtn ?: string,
    rounded ?: ROUNDED,
    showPrevNext ?: boolean,
    size ?: BUTTON_SIZE,
    variant ?: 'bordered' | 'flat',
    onPreviousClick ?: any,
    onNextClick ?: any,
    [key: string]: unknown
  }

  let {
    data = [],
    activeButtonClasses = "",
    align = "center",
    buttonClasses = "",
    nextBtn = "Next &rarr;",
    prevBtn = "&larr; Prev",
    rounded = "md",
    showPrevNext = true,
    size = "md",
    variant = "bordered",
    onPreviousClick,
    onNextClick,
    ...props
  } : Props = $props()

  let getNumLinkClass = (active: boolean|undefined = undefined) => active ?
                        twMerge(`bg-brand-primary-500 text-on-brand-primary-500 ${variant == "bordered" ? "" : roundedClass(rounded)}`, activeButtonClasses) :
                        twMerge(`bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-default hover:text-default ${variant == "bordered" ? "border-gray-200 dark:border-gray-600" : `border-y-0 border-s-0 last:border-e-0 ${roundedClass(rounded)}`}`, buttonClasses)
</script>

<div class={twMerge("theui-pagination flex", props?.class as string)} class:justify-center={align=="center"} class:justify-end={align=="end"}>
  <ButtonGroup label="Pagination" {size} {variant} {rounded} outline={true} class={variant == "flat" ? "gap-1" : ""}>
    {#snippet children()}
      {#if showPrevNext}
        <Button class={getNumLinkClass()} onclick={onPreviousClick} label={prevBtn} ariaLabel="Pagination link: previous"/>
      {/if}
      {#each data as link, i}
      <Button href={link.url} class={getNumLinkClass(link?.active)} label={(i+1).toString()} ariaLabel="Pagination page {i+1}"/>
      {/each}
      {#if showPrevNext}
        <Button class={getNumLinkClass()} onclick={onNextClick} label={nextBtn} ariaLabel="Pagination link: next"/>
      {/if}
    {/snippet}
  </ButtonGroup>
</div>