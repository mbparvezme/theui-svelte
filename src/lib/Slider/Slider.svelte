<script lang="ts">
	import { setContext, type Snippet, onMount } from "svelte"
	import { Slider } from "./slider"
	import { twMerge } from "tailwind-merge"
  import { Svg } from "$lib"

  interface Props {
    // Slider Config
    autoPlay?: boolean,
    stopOnHover?: boolean,
    slideDuration?: number,
    transitionDuration?: number,
    activeSlide?: number,
    indicatorClasses?: string,
    indicatorActiveClasses?: string,

    // Only Props
    children: Snippet,
    prevButton?: Snippet,
    nextButton?: Snippet,
    controls?: boolean,
    indicator?: boolean,
    timer?: boolean,
    slideClasses?: string,
    controlButtonClasses?: string,
    indicatorContainerClasses?: string,
    timerClasses?: string,

    [key: string] : unknown
  }

  let {
    // Option's default values
    autoPlay = true,
    stopOnHover = true,
    slideDuration = 5000,
    transitionDuration = 750,
    activeSlide = 1,
    indicatorClasses = "",
    indicatorActiveClasses = "",

    // Props default values
    children,
    prevButton,
    nextButton,
    controls = true,
    indicator = true,
    timer = true,
    slideClasses = "",
    controlButtonClasses = "",
    indicatorContainerClasses = "",
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
  })

  onMount(() => {
    if (!obj.SLIDERS[obj.id].slides?.length) {
      console.error("Slides is not defined or empty.")
      return
    }
    obj.createIndicator()
    obj.cloneSlides()
    if (!obj.SLIDERS[obj.id].activeSlide) {
      obj.SLIDERS[obj.id].activeSlide = obj.SLIDERS[obj.id].slides[activeSlide]
    }
    obj.updateActiveIndicator(activeSlide-1)
    obj.updateTrackPosition()
    if(obj.config.autoPlay){
      obj.startTimerAnimation()
      obj.startAutoPlay()
    }
  })

  setContext('SLIDER', {...obj.SLIDERS[obj.id], slideClasses})
</script>

{#if children}
<div id={obj.id} class="slider relative overflow-hidden w-full" onmouseenter={()=>obj.handleMouseEnter()} onmouseleave={()=>obj.handleMouseLeave()} role="region" aria-label="Image Slider" aria-live="polite">
  <div id={`${obj.id}-items`} class="slides flex {props?.class}">
    {@render children()}
  </div>

  {#if controls}
  <button id="{obj.id}-prev" class="prev-slide-button cursor-pointer {obj.getButtonClasses(controlButtonClasses, "prev")}" onclick={()=>obj.changeSlide("prev")} aria-label="Previous Slide">
    {#if prevButton}
      {@render prevButton()}
    {:else}
      <Svg size={2} class="opacity-50">
        <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
      </Svg>
    {/if}
  </button>
  <button id="{obj.id}-next" class="next-slide-button cursor-pointer {obj.getButtonClasses(controlButtonClasses, "next")}" onclick={()=>obj.changeSlide("next")} aria-label="Next Slide">
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