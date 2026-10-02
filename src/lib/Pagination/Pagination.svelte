<script lang="ts">
  import type { ANIMATE_SPEED, BUTTON_SIZE, ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
	import { roundedClass, coreSpeed } from "$lib/function"
  import { Button, ButtonGroup } from "$lib"

  interface Props {
    data ?: Array<{url: string, active?: boolean}>,
    align ?: 'start' | 'center' | 'end',
    size ?: BUTTON_SIZE,
    previousButton ?: string,
    nextButton ?: string,
    rounded ?: ROUNDED,
    animationSpeed ?: ANIMATE_SPEED,
    activeButtonClasses ?: string,
    buttonClasses ?: string,
    onPreviousClick ?: (e: MouseEvent) => void,
    onNextClick ?: (e: MouseEvent) => void,
    // Borderless buttons with a gap between them
    flat ?: boolean,
    // Hide the previous and next buttons
    hidePreviousNext ?: boolean,
    hidePrevious ?: boolean,
    hideNext ?: boolean,
    [key: string]: unknown // class, id, data-*
  }

  let {
    data = [],
    align = "center",
    size = "md",
    previousButton = "← Prev",
    nextButton = "Next →",
    rounded = "md",
    animationSpeed = coreSpeed(),
    activeButtonClasses = "",
    buttonClasses = "",
    onPreviousClick,
    onNextClick,
    flat = false,
    hidePreviousNext = false,
    hidePrevious = false,
    hideNext = false,
    ...props
  } : Props = $props()

  let paginationEl: HTMLElement | null = $state(null)

  let handlePaginationKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

    const buttons = Array.from(
      paginationEl?.querySelectorAll('a[role="link"], button[role="button"]') ?? []
    ) as HTMLElement[]

    if (buttons.length === 0) return

    e.preventDefault()

    const currentIndex = buttons.findIndex(el => el === document.activeElement)
    const nextIndex = currentIndex === -1
      ? 0
      : e.key === 'ArrowRight'
        ? Math.min(currentIndex + 1, buttons.length - 1)
        : Math.max(currentIndex - 1, 0)

    buttons[nextIndex]?.focus()
  }

  const getNumLinkClass = (active: boolean|undefined = undefined) => active ?
                        twMerge(`bg-brand-500 text-on-brand ${flat ? roundedClass(rounded) : ""}`, activeButtonClasses) :
                        twMerge(`bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-default hover:text-default ${flat ? `border-y-0 border-s-0 last:border-e-0 ${roundedClass(rounded)}` : "border-gray-200 dark:border-gray-600"}`, buttonClasses)
</script>

<div bind:this={paginationEl} {...props} onkeydown={handlePaginationKeydown} class={twMerge("theui-pagination flex", props?.class as string)} class:justify-center={align=="center"} class:justify-end={align=="end"}>
  <ButtonGroup ariaLabel="Pagination" {size} {rounded} variant={flat ? "flat" : "bordered"} outline={true} {animationSpeed} class={flat ? "gap-1" : ""}>
    {#if !hidePreviousNext && !hidePrevious}
      <Button class={getNumLinkClass()} onclick={onPreviousClick} ariaLabel="Pagination link: previous">
        {previousButton}
      </Button>
    {/if}

    {#each data as link, i (link.url)}
      {@const isActive = link?.active ?? false}
      {@const linkClass = isActive
        ? twMerge(`bg-brand-500 text-on-brand ${flat ? roundedClass(rounded) : ""}`, activeButtonClasses)
        : twMerge(`bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-default hover:text-default ${flat ? `border-y-0 border-s-0 last:border-e-0 ${roundedClass(rounded)}` : "border-gray-200 dark:border-gray-600"}`, buttonClasses)}
      <Button href={link.url} class={linkClass} ariaLabel="Pagination page {i+1}" aria-current={isActive ? "page" : undefined}>{(i+1).toString()}</Button>
    {/each}

    {#if !hidePreviousNext && !hideNext}
      <Button class={getNumLinkClass()} onclick={onNextClick} ariaLabel="Pagination link: next">
        {nextButton}
      </Button>
    {/if}
  </ButtonGroup>
</div>
