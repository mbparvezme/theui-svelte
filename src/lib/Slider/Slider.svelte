<script lang="ts">
  import { onMount, setContext, untrack, type Snippet } from "svelte"
  import { SvelteMap } from "svelte/reactivity"
  import Svg from "$lib/Utility/Svg.svelte"
  import type { SLIDE_INFO, SLIDE_STATE, SLIDER_CTX, SLIDER_DIRECTION, SLIDER_EFFECT, SLIDER_RESPONSIVE } from "$lib/types"
  import * as S from "./slider"

  interface Props {
    children: Snippet,
    prevButton?: Snippet,
    nextButton?: Snippet,
    // Content that stays on top while the slides change, like a hero title
    overlay?: Snippet,

    // Behavior
    activeSlide?: number,
    autoPlay?: boolean,
    // Auto play stopped by the pause button, or by your own control with bind:paused
    paused?: boolean,
    stopOnHover?: boolean,
    slideDuration?: number,
    transitionDuration?: number,
    loop?: boolean,
    swipe?: boolean,
    mousewheel?: boolean,
    onchange?: (activeSlide: number) => void,

    // Layout and effect
    effect?: SLIDER_EFFECT,
    kenBurns?: boolean,
    parallax?: boolean | number,
    direction?: SLIDER_DIRECTION,
    perView?: SLIDER_RESPONSIVE<number>,
    gap?: SLIDER_RESPONSIVE<number | string>,
    peek?: SLIDER_RESPONSIVE<number | string>,
    centered?: boolean,

    // Parts
    controls?: boolean,
    indicator?: boolean,
    thumbnails?: boolean,
    timer?: boolean,
    fraction?: boolean,
    pauseButton?: boolean,
    ariaLabel?: string,

    // Classes
    slideClasses?: string,
    controlButtonClasses?: string,
    indicatorContainerClasses?: string,
    indicatorClasses?: string,
    indicatorActiveClasses?: string,
    thumbnailContainerClasses?: string,
    thumbnailClasses?: string,
    thumbnailActiveClasses?: string,
    timerClasses?: string,
    fractionClasses?: string,
    pauseButtonClasses?: string,
    overlayClasses?: string,

    [key: string]: unknown
  }

  let {
    children,
    prevButton,
    nextButton,
    overlay,

    activeSlide = $bindable(1),
    autoPlay = true,
    paused = $bindable(false),
    stopOnHover = true,
    slideDuration = 5000,
    transitionDuration = 750,
    loop = true,
    swipe = true,
    mousewheel = false,
    onchange,

    // `effect` cannot be a local name next to the $effect rune
    effect: effectType = "slide",
    kenBurns = false,
    parallax = false,
    direction = "horizontal",
    perView = 1,
    gap = 0,
    peek = 0,
    centered = false,

    controls = true,
    indicator = true,
    thumbnails = false,
    timer = true,
    fraction = false,
    pauseButton = true,
    ariaLabel = "Slider",

    slideClasses = "",
    controlButtonClasses = "",
    indicatorContainerClasses = "",
    indicatorClasses = "",
    indicatorActiveClasses = "",
    thumbnailContainerClasses = "",
    thumbnailClasses = "",
    thumbnailActiveClasses = "",
    timerClasses = "",
    fractionClasses = "",
    pauseButtonClasses = "",
    overlayClasses = "",
    ...props
  }: Props = $props()

  const uid = $props.id()
  const slidesId = `${uid}-slides`

  let root: HTMLElement | undefined = $state()
  let viewport: HTMLElement | undefined = $state()
  let thumbStrip: HTMLElement | undefined = $state()

  // ---------------------------------------------------------------- Slides and layout

  // Ids of the registered slides, in DOM order
  let ids: string[] = $state([])
  // Reactive, so a thumbnail that arrives after the slide registered still shows up
  const slideInfo = new SvelteMap<string, SLIDE_INFO>()

  // Breakpoints that match the window now
  let screens: string[] = $state([])
  let rtl = $state(false)
  let reduced = $state(false)
  // Size of the slides area, needed for the depth of the cube
  let width = $state(0)
  let height = $state(0)

  const total = $derived(ids.length)
  const vertical = $derived(direction === "vertical")
  const isSlide = $derived(effectType === "slide")
  // Only the slide effect can show several slides, peek or center
  const view = $derived(isSlide ? Math.max(1, Math.floor(S.pickResponsive(perView, 1, screens)) || 1) : 1)
  const gapValue = $derived(isSlide ? S.cssLength(S.pickResponsive(gap, 0, screens)) : "0px")
  const peekValue = $derived(isSlide ? S.cssLength(S.pickResponsive(peek, 0, screens)) : "0px")
  const peekSlots = $derived(S.isZeroLength(peekValue) ? 0 : 1)
  const centerShift = $derived(isSlide && centered ? (view - 1) / 2 : 0)
  // Looping needs enough slides to fill everything in view without showing one twice
  const looping = $derived(loop && total >= S.slideSpan(view, peekSlots))
  // Number of positions the slider can stop at
  const count = $derived(looping || (isSlide && centered) ? total : Math.max(0, total - view + 1))

  const layout: S.SLIDER_LAYOUT = $derived({
    effect: effectType, vertical, rtl, total, view, centerShift, peekSlots, looping, width, height
  })

  // ---------------------------------------------------------------- Position

  const initial = untrack(() => Math.max(0, (Math.round(activeSlide) || 1) - 1))
  // Current slide, 0 based
  let index = $state(initial)
  // Slide the slider is moving to. It can leave the 0..total range while looping.
  let target = initial
  // Position shown on screen, in slides. It changes every frame during a move or a drag.
  let pos = $state(initial)

  let frame = 0
  let focusAfterMove = false

  const slideState = (id: string): SLIDE_STATE => {
    const i = ids.indexOf(id)
    const placement = S.slidePlacement(S.slideOffset(Math.max(0, i), pos, layout), layout)
    if (i < 0) placement.visible = placement.current = false
    return { index: i, total, active: i === index, ...placement }
  }

  setContext<SLIDER_CTX>("SLIDER", {
    add: (id, info) => untrack(() => {
      slideInfo.set(id, info)
      if (!ids.includes(id)) ids.push(id)
    }),
    remove: (id) => untrack(() => {
      slideInfo.delete(id)
      const i = ids.indexOf(id)
      if (i > -1) ids.splice(i, 1)
    }),
    slide: slideState,
    get slideClasses() { return slideClasses },
    get kenBurns() { return kenBurns && !reduced },
    // The zoom runs while the slide is shown and while it moves out
    get kenBurnsDuration() { return slideDuration + transitionDuration * 2 },
    // Image parallax needs a moving slide; in the other effects the image would leave a gap
    get parallax() {
      if (!isSlide || !parallax) return 0
      return parallax === true ? 0.5 : S.clamp(Number(parallax) || 0, 0, 1)
    },
    get vertical() { return vertical },
    get rtl() { return rtl }
  })

  // Slides added later by an {#each} can register out of order, so follow the DOM
  $effect(() => {
    void ids.length
    const el = viewport
    if (!el) return
    untrack(() => {
      const order = Array.from(el.querySelectorAll<HTMLElement>("[data-slide-id]"))
        .filter((slide) => slide.closest(".theui-slider-slides") === el)
        .map((slide) => slide.dataset.slideId as string)
      if (order.length === ids.length && order.some((id, i) => id !== ids[i])) {
        ids.splice(0, ids.length, ...order)
      }
    })
  })

  // ---------------------------------------------------------------- Navigation

  const setIndex = (i: number) => {
    if (activeSlide !== i + 1) activeSlide = i + 1
    if (i === index) return
    index = i
    onchange?.(i + 1)
  }

  const settle = () => {
    if (looping && total) {
      const n = S.mod(target, total)
      pos = n
      target = n
    }
    if (focusAfterMove) {
      focusAfterMove = false
      viewport?.querySelector<HTMLElement>(`[data-slide-id="${ids[index]}"]`)?.focus({ preventScroll: true })
    }
  }

  const animate = (to: number) => {
    cancelAnimationFrame(frame)
    frame = 0
    const from = pos
    const duration = reduced ? 0 : transitionDuration
    if (duration <= 0 || from === to) {
      pos = to
      settle()
      return
    }
    const began = performance.now()
    const step = (now: number) => {
      const done = Math.min(1, (now - began) / duration)
      pos = from + (to - from) * S.ease(done)
      if (done < 1) {
        frame = requestAnimationFrame(step)
      } else {
        frame = 0
        settle()
      }
    }
    frame = requestAnimationFrame(step)
  }

  const goTo = (to: number) => {
    if (!count) return
    if (!looping) to = S.clamp(to, 0, count - 1)
    target = to
    setIndex(looping ? S.mod(to, total) : to)
    elapsed = 0
    movedAt = performance.now()
    progress = 0
    animate(to)
  }

  const next = () => goTo(target + 1)
  const prev = () => goTo(target - 1)

  // Moves to a slide by its index, taking the shorter way round while looping
  const goToIndex = (i: number) => {
    if (!count) return
    i = S.clamp(Math.round(i) || 0, 0, count - 1)
    goTo(looping ? target + S.loopDistance(i, target, total) : i)
  }

  // bind:activeSlide changed from outside
  $effect(() => {
    const wanted = activeSlide
    untrack(() => {
      if (count && Math.round(wanted) - 1 !== index) goToIndex((Math.round(wanted) || 1) - 1)
    })
  })

  // Slides added or removed, or loop and perView changed: keep the position valid
  $effect(() => {
    const positions = count
    void looping
    untrack(() => {
      if (!positions) return
      // An activeSlide above the slide count, or a removed last slide, stops at the last slide
      const i = S.clamp(index, 0, positions - 1)
      if (i === pos && i === target && i === index) return
      cancelAnimationFrame(frame)
      frame = 0
      target = i
      pos = i
      setIndex(i)
    })
  })

  // ---------------------------------------------------------------- Auto play

  let hovered = $state(false)
  let focused = $state(false)
  let hidden = $state(false)
  let offscreen = $state(false)
  let dragging = $state(false)
  let progress = $state(0)
  // How long the current slide has played, and when the slide last changed
  let elapsed = 0
  let movedAt = 0

  const playing = $derived(autoPlay && !paused && !reduced && count > 1)
  const running = $derived(playing && !(stopOnHover && hovered) && !focused && !hidden && !offscreen && !dragging)
  const showTimer = $derived(timer && autoPlay && !reduced && count > 1)

  const advance = () => {
    if (!looping && index >= count - 1) goToIndex(0)
    else next()
  }

  $effect(() => {
    if (!running) return
    let last = performance.now()

    // Without the timer bar nothing shows the progress, so one timeout per slide is enough
    if (!showTimer) {
      // Adds the time since the last check, or since the slide changed if that came later
      const addPlayed = () => {
        const now = performance.now()
        elapsed += now - Math.max(last, movedAt)
        last = now
      }
      let id: ReturnType<typeof setTimeout>
      const wait = (delay: number) => {
        id = setTimeout(() => {
          addPlayed()
          if (elapsed >= slideDuration) advance()
          wait(slideDuration - elapsed)
        }, Math.max(0, delay))
      }
      wait(slideDuration - elapsed)
      return () => {
        clearTimeout(id)
        addPlayed()
      }
    }

    let id = requestAnimationFrame(function tick(now) {
      // A long gap means the page was frozen, so it does not count
      elapsed += Math.min(Math.max(0, now - last), 100)
      last = now
      if (elapsed >= slideDuration) advance()
      progress = Math.min(1, elapsed / slideDuration)
      id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  })

  const togglePlay = () => {
    if (playing) {
      paused = true
    } else {
      paused = false
      focused = false
    }
  }

  onMount(() => {
    if (root) rtl = getComputedStyle(root).direction === "rtl"

    // matchMedia is missing in some test environments
    const media = (query: string) => window.matchMedia?.(query)
    const motion = media("(prefers-reduced-motion: reduce)")
    const onMotion = () => reduced = !!motion?.matches
    const screenQueries = S.BREAKPOINTS.map(([name, size]) => [name, media(`(min-width: ${size})`)] as const)
    const onScreen = () => screens = screenQueries.filter(([, query]) => query?.matches).map(([name]) => name)
    const onVisibility = () => hidden = document.visibilityState === "hidden"
    onMotion()
    onScreen()
    onVisibility()
    motion?.addEventListener("change", onMotion)
    screenQueries.forEach(([, query]) => query?.addEventListener("change", onScreen))
    document.addEventListener("visibilitychange", onVisibility)

    const resize = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(() => {
      width = viewport?.clientWidth ?? 0
      height = viewport?.clientHeight ?? 0
    })
    if (viewport) resize?.observe(viewport)

    // Auto play waits while the slider is scrolled out of view
    const view = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver((entries) => {
      offscreen = !entries[entries.length - 1].isIntersecting
    })
    if (root) view?.observe(root)

    return () => {
      resize?.disconnect()
      view?.disconnect()
      motion?.removeEventListener("change", onMotion)
      screenQueries.forEach(([, query]) => query?.removeEventListener("change", onScreen))
      document.removeEventListener("visibilitychange", onVisibility)
      cancelAnimationFrame(frame)
    }
  })

  // Keeps the active thumbnail in the middle of the strip, without scrolling the page
  $effect(() => {
    const i = index
    const strip = thumbStrip
    if (!strip) return
    const thumb = strip.children[i] as HTMLElement | undefined
    if (!thumb) return
    untrack(() => {
      const box = strip.getBoundingClientRect()
      if (box.bottom < 0 || box.top > window.innerHeight) return
      const shift = thumb.getBoundingClientRect().left + thumb.offsetWidth / 2 - (box.left + strip.clientWidth / 2)
      strip.scrollBy?.({ left: shift, behavior: reduced ? "auto" : "smooth" })
    })
  })

  // ---------------------------------------------------------------- Pointer, focus and keyboard

  const onpointerenter = (e: PointerEvent) => { if (e.pointerType === "mouse") hovered = true }
  const onpointerleave = (e: PointerEvent) => { if (e.pointerType === "mouse") hovered = false }

  // Only keyboard focus stops auto play, a mouse click on a control does not
  const onfocusin = (e: FocusEvent) => {
    try {
      if ((e.target as Element).matches(":focus-visible")) focused = true
    } catch {
      focused = true
    }
  }

  const onfocusout = (e: FocusEvent) => {
    if (!root?.contains(e.relatedTarget as Node | null)) focused = false
  }

  const isField = (el: EventTarget | null) =>
    el instanceof Element && !!el.closest("input, textarea, select, [contenteditable='true']")

  const onkeydown = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || count < 2 || isField(e.target)) return
    const back = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft"
    const forward = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight"

    let move: (() => void) | undefined
    if (e.key === back) move = prev
    else if (e.key === forward) move = next
    else if (e.key === "Home") move = () => goToIndex(0)
    else if (e.key === "End") move = () => goToIndex(count - 1)
    if (!move) return

    e.preventDefault()
    // Focus inside a slide that moves out of view would be lost, so it moves to the new slide
    focusAfterMove = !!viewport?.contains(e.target as Node)
    move()
  }

  // ---------------------------------------------------------------- Swipe

  let drag: { id: number, x: number, y: number, from: number, step: number, moved: boolean } | null = null
  let blockClick = false

  const onpointerdown = (e: PointerEvent) => {
    blockClick = false
    drag = null
    if (!swipe || count < 2 || !viewport || (e.pointerType === "mouse" && e.button !== 0) || isField(e.target)) return
    const size = vertical ? viewport.clientHeight : viewport.clientWidth
    if (!size) return
    // The gap and the peek are set as the column and row gap of the slides area, so the browser turns them into pixels
    const styles = getComputedStyle(viewport)
    const step = S.dragStep(size, parseFloat(styles.columnGap) || 0, parseFloat(styles.rowGap) || 0, view)
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, from: pos, step, moved: false }
  }

  const onpointermove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id || !viewport) return
    const main = vertical ? e.clientY - drag.y : e.clientX - drag.x
    const cross = vertical ? e.clientX - drag.x : e.clientY - drag.y

    if (!drag.moved) {
      if (Math.abs(main) < 8) {
        if (Math.abs(cross) >= 8) drag = null
        return
      }
      if (Math.abs(cross) > Math.abs(main)) {
        drag = null
        return
      }
      // The drag starts from where a running move is now
      cancelAnimationFrame(frame)
      frame = 0
      drag.moved = true
      drag.from = pos
      drag.x = e.clientX
      drag.y = e.clientY
      dragging = true
      try { viewport.setPointerCapture(e.pointerId) } catch { /* pointer already released */ }
      return
    }

    const moved = drag.from - (vertical || !rtl ? main : -main) / drag.step
    pos = looping ? moved : S.resistEdges(moved, count - 1)
  }

  const onpointerup = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return
    const { moved, from } = drag
    drag = null
    if (!moved) return
    dragging = false
    blockClick = true
    goTo(S.dragLanding(pos, from))
  }

  // A drag must not follow a link or press a button inside the slide
  const onclickcapture = (e: MouseEvent) => {
    if (!blockClick) return
    blockClick = false
    e.preventDefault()
    e.stopPropagation()
  }

  // Focus or find-in-page can scroll a hidden overflow; the slides are placed by transform only
  const onscroll = () => {
    if (!viewport) return
    viewport.scrollLeft = 0
    viewport.scrollTop = 0
  }

  // ---------------------------------------------------------------- Mousewheel

  $effect(() => {
    const el = viewport
    if (!mousewheel || !el) return
    let locked = false
    let timeout: ReturnType<typeof setTimeout> | undefined

    // A trackpad sends many events for one gesture, so a gesture moves one slide
    const lock = () => {
      locked = true
      clearTimeout(timeout)
      timeout = setTimeout(() => locked = false, 200)
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || count < 2) return
      const useX = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      let delta = useX ? e.deltaX : e.deltaY
      if (useX && rtl && !vertical) delta = -delta
      if (!delta) return
      if (locked) {
        e.preventDefault()
        lock()
        return
      }
      // At the first or last slide the page scrolls as usual
      if (!looping && (delta > 0 ? index >= count - 1 : index <= 0)) return
      e.preventDefault()
      lock()
      if (delta > 0) next()
      else prev()
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
      clearTimeout(timeout)
    }
  })
</script>

<section
  {...props}
  bind:this={root}
  class={S.rootClasses(vertical, props?.class as string)}
  aria-roledescription="carousel"
  aria-label={ariaLabel}
  {onkeydown}
  {onpointerenter}
  {onpointerleave}
  {onfocusin}
  {onfocusout}
>
  <div class="theui-slider-stage relative w-full flex-1 min-h-0">
    {#if overlay}
      <div class={S.overlayClasses(overlayClasses)}>{@render overlay()}</div>
    {/if}

    {#if showTimer}
      <div class={S.timerClasses(timerClasses)} style="transform:scaleX({progress})" aria-hidden="true"></div>
    {/if}

    {#if fraction && count > 1}
      <!-- Screen readers hear "2 of 5" from the slide itself -->
      <div class={S.fractionClasses(fractionClasses)} aria-hidden="true">{index + 1} / {count}</div>
    {/if}

    {#if pauseButton && autoPlay && !reduced && count > 1}
      <button type="button" class={S.pauseButtonClasses(pauseButtonClasses)} onclick={togglePlay} aria-controls={slidesId} aria-label={playing ? "Stop automatic slide show" : "Start automatic slide show"}>
        {#if playing}
          <Svg size={1}><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/></Svg>
        {:else}
          <Svg size={1}><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></Svg>
        {/if}
      </button>
    {/if}

    {#if controls && count > 1}
      <button type="button" class={S.controlClasses("prev", vertical, controlButtonClasses)} onclick={prev} disabled={!looping && index <= 0} aria-controls={slidesId} aria-label="Previous slide">
        {#if prevButton}
          {@render prevButton()}
        {:else}
          <Svg size={2} class="opacity-50 {vertical ? 'rotate-90' : 'rtl:rotate-180'}">
            <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
          </Svg>
        {/if}
      </button>
      <button type="button" class={S.controlClasses("next", vertical, controlButtonClasses)} onclick={next} disabled={!looping && index >= count - 1} aria-controls={slidesId} aria-label="Next slide">
        {#if nextButton}
          {@render nextButton()}
        {:else}
          <Svg size={2} class="opacity-50 {vertical ? 'rotate-90' : 'rtl:rotate-180'}">
            <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
          </Svg>
        {/if}
      </button>
    {/if}

    {#if indicator && count > 1}
      <div class={S.indicatorContainerClasses(vertical, indicatorContainerClasses)}>
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each { length: count } as _, i (i)}
          <button type="button" class={S.indicatorClasses(i === index, vertical, indicatorClasses, indicatorActiveClasses)} onclick={() => goToIndex(i)} aria-controls={slidesId} aria-label="Go to slide {i + 1}" aria-current={i === index ? "true" : undefined}></button>
        {/each}
      </div>
    {/if}

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={viewport}
      id={slidesId}
      class={S.slidesClasses(vertical, swipe, dragging)}
      style="--theui-slider-gap:{gapValue};--theui-slider-peek:{peekValue};column-gap:var(--theui-slider-gap);row-gap:var(--theui-slider-peek)"
      aria-live={running ? "off" : "polite"}
      {onpointerdown}
      {onpointermove}
      {onpointerup}
      onpointercancel={onpointerup}
      {onclickcapture}
      {onscroll}
      ondragstart={(e) => { if (swipe) e.preventDefault() }}
    >
      {@render children()}
    </div>
  </div>

  {#if thumbnails && total > 1}
    <div bind:this={thumbStrip} class={S.thumbnailContainerClasses(thumbnailContainerClasses)}>
      {#each ids as id, i (id)}
        {@const thumb = slideInfo.get(id)?.thumbnail}
        <button type="button" class={S.thumbnailClasses(i === index, thumbnailClasses, thumbnailActiveClasses)} onclick={() => goToIndex(i)} aria-controls={slidesId} aria-label="Go to slide {i + 1}" aria-current={i === index ? "true" : undefined}>
          {#if thumb}
            <img src={thumb} alt="" loading="lazy" draggable="false" class="size-full object-cover" />
          {:else}
            <span aria-hidden="true">{i + 1}</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</section>
