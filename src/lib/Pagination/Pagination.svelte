<script lang="ts">
  import type { ANIMATE_SPEED, BUTTON_SIZE, ROUNDED } from "$lib/types";
  import { twMerge } from "tailwind-merge";
	import { roundedClass } from "$lib/function";
  import { Button, ButtonGroup } from "$lib";

  interface Props {
    data ?: Array<{url: string, active?: boolean}>,
    align ?: 'start' | 'center' | 'end',
    size ?: BUTTON_SIZE,
    previousButton ?: string,
    nextButton ?: string,
    rounded ?: ROUNDED,
    animate ?: ANIMATE_SPEED,
    activeButtonClasses ?: string,
    buttonClasses ?: string,
    onPreviousClick ?: Function,
    onNextClick ?: Function,
    [key: string]: unknown
  }

  let {
    data = [],
    align = "center",
    size = "md",
    previousButton = "&larr; Prev",
    nextButton = "Next &rarr;",
    rounded = "md",
    animate = "normal",
    activeButtonClasses = "",
    buttonClasses = "",
    onPreviousClick,
    onNextClick,
    ...props // flat, hidePreviousNext
  } : Props = $props()

  let getNumLinkClass = (active: boolean|undefined = undefined) => active ?
                        twMerge(`bg-brand-primary-500 text-on-brand-primary-500 ${props?.flat ? roundedClass(rounded) : ""}`, activeButtonClasses) :
                        twMerge(`bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-default hover:text-default ${props?.flat ? `border-y-0 border-s-0 last:border-e-0 ${roundedClass(rounded)}` : "border-gray-200 dark:border-gray-600"}`, buttonClasses)
</script>

<div class={twMerge("theui-pagination flex", props?.class as string)} class:justify-center={align=="center"} class:justify-end={align=="end"}>
  <ButtonGroup label="Pagination" {size} {rounded} variant={props?.flat ? "flat" : "bordered"} outline={true} {animate} class={props?.flat ? "gap-1" : ""}>
    {#if !props?.hidePreviousNext && !props?.hidePrevious}
      <Button class={getNumLinkClass()} onclick={onPreviousClick} ariaLabel="Pagination link: previous">
        {@html previousButton}
      </Button>
    {/if}

    {#each data as link, i}
      <Button href={link.url} class={getNumLinkClass(link?.active)} ariaLabel="Pagination page {i+1}">{(i+1).toString()}</Button>
    {/each}

    {#if !props?.hidePreviousNext && !props?.hideNext}
      <Button class={getNumLinkClass()} onclick={onNextClick} ariaLabel="Pagination link: next">
        {@html nextButton}
      </Button>
    {/if}
  </ButtonGroup>
</div>