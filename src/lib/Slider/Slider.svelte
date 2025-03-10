<script lang="ts">
	import { setContext, type Snippet, onMount } from "svelte"
  import { ST_SLIDER } from "$lib/state.svelte"
	import { Slider } from "./slider"
	import { twMerge } from "tailwind-merge"
  import { Svg } from "$lib"

  interface Props {
    children: Snippet,
    prevButton?: Snippet,
    nextButton?: Snippet,
    controls?: boolean,
    indicator?: boolean,
    autoPlay?: boolean,
    stopOnHover?: boolean,
    slideDuration?: number,
    transitionDuration?: number,
    timer?: boolean,
    activeSlide?: number,

    slideClasses?: string,
    controlButtonClasses?: string,
    indicatorContainerClasses?: string,
    indicatorClasses?: string,
    indicatorActiveClasses?: string,
    timerClasses?: string,

    [key: string] : unknown
  }

  let {
    children,
    prevButton,
    nextButton,
    controls = true,
    indicator = true,
    autoPlay = true,
    stopOnHover = true,
    slideDuration = 5000,
    transitionDuration = 750,
    timer = true,
    activeSlide = 1,

    slideClasses = "",
    controlButtonClasses = "",
    indicatorContainerClasses = "",
    indicatorClasses = "",
    indicatorActiveClasses = "",
    timerClasses = "",
    ...props
  } : Props = $props()

  const obj = new Slider({
    autoPlay,
    stopOnHover,
    slideDuration,
    transitionDuration,
    activeSlide,
    indicatorClasses,
    indicatorActiveClasses
  });

  onMount(() => {
    if (!ST_SLIDER.slides?.length) {
      console.error("ST_SLIDER.slides is not defined or empty.")
      return
    }
    obj.createIndicator()
    obj.cloneSlides()
    if (!ST_SLIDER.activeSlide) {
      ST_SLIDER.activeSlide = ST_SLIDER.slides[activeSlide]
    }
    obj.updateActiveIndicator(activeSlide-1)
    obj.updateTrackPosition()
    if(obj.config.autoPlay){
      obj.startTimerAnimation()
      obj.startAutoPlay()
    }
  })

  setContext('SLIDER', {...ST_SLIDER, slideClasses})
</script>

{#if children}
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id={obj.id} class="slider relative overflow-hidden w-full" onmouseenter={()=>obj.handleMouseEnter()} onmouseleave={()=>obj.handleMouseLeave()} role="region" aria-label="Image Slider" aria-live="polite">
  <div id={`${obj.id}-items`} class="slides flex {props?.class}">
    {@render children()}
  </div>

  {#if controls}
  <button id="{obj.id}-prev" class="prev-slide-button {obj.getButtonClasses(controlButtonClasses, "prev")}" onclick={()=>obj.changeSlide("prev")} aria-label="Previous Slide">
    {#if prevButton}
      {@render prevButton()}
    {:else}
      <Svg size={2} class="opacity-50">
        <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
      </Svg>
    {/if}
  </button>
  <button id="{obj.id}-next" class="next-slide-button {obj.getButtonClasses(controlButtonClasses, "next")}" onclick={()=>obj.changeSlide("next")} aria-label="Next Slide">
    {#if nextButton}
      {@render nextButton()}
    {:else}
      <Svg size={2} class="opacity-50">
        <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
      </Svg>
    {/if}
  </button>
  {/if}

  {#if timer}
  <div id="{obj.id}-timer" class="slide-timer absolute {twMerge("top-0 start-0 h-1 bg-gray-500 mix-blend-difference opacity-70", timerClasses)}"></div>
  {/if}

  {#if indicator}
    <div id="{obj.id}-indicators" class="slide-indicators absolute z-[1] {obj.getIndicatorContainerClasses(indicatorContainerClasses)}"></div>
  {/if}

</div>
{/if}