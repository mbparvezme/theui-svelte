import { twMerge } from "tailwind-merge"
import type { SLIDER_BREAKPOINT, SLIDER_EFFECT, SLIDER_RESPONSIVE } from "$lib/types"

// ---------------------------------------------------------------- Numbers

// Remainder that is never negative, for positions that wrap around
export const mod = (n: number, m: number) => ((n % m) + m) % m

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

// Ease in and out, for moves between slides
export const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const cssLength = (value: number | string) => typeof value === "number" ? `${value}px` : value

export const isZeroLength = (value: string) => /^0([a-z%]*)$/i.test(value.trim())

// ---------------------------------------------------------------- Screen size

// Tailwind's default breakpoints
export const BREAKPOINTS: [Exclude<SLIDER_BREAKPOINT, "base">, string][] = [
  ["sm", "40rem"], ["md", "48rem"], ["lg", "64rem"], ["xl", "80rem"], ["2xl", "96rem"]
]

// The value for the current screen: the largest matching breakpoint, then base
export const pickResponsive = <T>(value: SLIDER_RESPONSIVE<T>, fallback: T, screens: string[]): T => {
  if (value === null || typeof value !== "object") return value as T
  const values = value as Partial<Record<SLIDER_BREAKPOINT, T>>
  let result = values.base ?? fallback
  for (const [name] of BREAKPOINTS) {
    if (screens.includes(name) && values[name] !== undefined) result = values[name] as T
  }
  return result
}

// ---------------------------------------------------------------- Layout

export type SLIDER_LAYOUT = {
  effect: SLIDER_EFFECT,
  vertical: boolean,
  rtl: boolean,
  total: number,
  // Slides in view at once
  view: number,
  // Slots the slides move by so the active slides sit in the middle
  centerShift: number,
  // 1 when the neighbors peek in at the edges
  peekSlots: number,
  looping: boolean,
  // Size of the slides area in pixels, for the depth of the cube
  width: number,
  height: number
}

// Slides that can be seen at the same time during a move
export const slideSpan = (view: number, peekSlots: number) => view + 1 + 2 * peekSlots

// Distance of a slide from the current position, in slides
export const slideOffset = (i: number, pos: number, layout: SLIDER_LAYOUT) => {
  const { total, view, centerShift, peekSlots, looping } = layout
  if (!looping) return i - pos
  // Every slide is placed once inside a window of `total` slots that starts at the first
  // slot in view, so the slides that wrap around are always out of view when they jump.
  const firstInView = Math.floor(pos - centerShift - 1 - peekSlots) + 1
  const first = firstInView - Math.floor((total - slideSpan(view, peekSlots)) / 2)
  return first + mod(i - first, total) - pos
}

// Where a slide is painted, and whether it can be seen and reached, for its offset
export const slidePlacement = (rawOffset: number, layout: SLIDER_LAYOUT) => {
  const { effect, vertical, rtl, view, centerShift, peekSlots, width, height } = layout
  const offset = Math.round(rawOffset * 10000) / 10000
  const distance = Math.abs(offset)
  // Place among the slots in view: 0 is the first full slot
  const slot = offset + centerShift
  // Moving forward is to the left, or to the right in a right-to-left page
  const dir = vertical || !rtl ? 1 : -1

  let visible: boolean
  let current: boolean
  let style: string

  if (effect === "slide") {
    visible = slot > -1 - peekSlots + 0.001 && slot < view + peekSlots - 0.001
    current = slot > -0.01 && slot < view - 0.99
    const size = `calc((100% - 2 * var(--theui-slider-peek) - ${view - 1} * var(--theui-slider-gap)) / ${view})`
    const shift = `calc(${dir} * var(--theui-slider-peek) + ${slot * dir} * (100% + var(--theui-slider-gap)))`
    style = vertical
      ? `height:${size};min-height:0;transform:translate3d(0,${shift},0);`
      : `width:${size};transform:translate3d(${shift},0,0);`
  } else {
    // Every other effect stacks the slides in one place, with the nearest slide on top
    visible = distance < 0.999
    current = distance < 0.5
    style = `z-index:${distance < 0.5 ? 1 : 0};`
    if (effect === "fade") {
      style += `opacity:${1 - distance};`
    } else if (effect === "zoom") {
      // The incoming slide grows from 80%, the outgoing one grows past 100% while it fades
      style += `opacity:${1 - distance};transform:scale(${1 - offset * 0.2});`
    } else if (effect === "flip") {
      // Each slide shows its front for half of the turn only
      visible = distance < 0.5
      const turn = vertical ? `rotateX(${offset * 180}deg)` : `rotateY(${-offset * 180 * dir}deg)`
      style += `backface-visibility:hidden;transform:perspective(1200px) ${turn};`
    } else if (effect === "cube") {
      // The slides are the sides of a cube that turns around its center
      const depth = (vertical ? height : width) / 2
      const turn = vertical ? `rotateX(${-offset * 90}deg)` : `rotateY(${offset * 90 * dir}deg)`
      style += `backface-visibility:hidden;transform:perspective(${Math.max(1200, depth * 4)}px) translateZ(${-depth}px) ${turn} translateZ(${depth}px);`
    }
  }

  if (!visible) style += "visibility:hidden;"

  // The slides fully in view stay still; only the slides at the edges move
  const edge = effect !== "slide" ? offset
    : slot < 0 ? slot
    : slot > view - 1 ? slot - (view - 1)
    : 0

  return { visible, current, style, parallax: clamp(edge, -1, 1) }
}

// ---------------------------------------------------------------- Navigation

// Signed distance from the target to a slide, the shorter way round
export const loopDistance = (i: number, target: number, total: number) => {
  let distance = mod(i - mod(target, total), total)
  if (distance > total / 2) distance -= total
  return distance
}

// Pixels one slide move takes, with the gap and the peek of the slides area
export const dragStep = (size: number, gapPx: number, peekPx: number, view: number) => {
  const step = (size - 2 * peekPx - (view - 1) * gapPx) / view + gapPx
  return step > 0 ? step : size
}

// Where a released drag lands: 15% of a slide is enough to move to the next one
export const dragLanding = (pos: number, from: number) =>
  pos > from ? Math.floor(pos + 0.85) : Math.ceil(pos - 0.85)

// Pulls back a drag past the first or last slide
export const resistEdges = (pos: number, last: number) =>
  pos < 0 ? pos / 3 : pos > last ? last + (pos - last) / 3 : pos

// ---------------------------------------------------------------- Classes

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"

export const rootClasses = (vertical: boolean, classes: string) =>
  twMerge("theui-slider relative flex flex-col w-full", vertical && "h-96", classes)

export const slidesClasses = (vertical: boolean, swipe: boolean, dragging: boolean) => twMerge(
  "theui-slider-slides grid grid-cols-1 grid-rows-[minmax(0,1fr)] size-full overflow-hidden",
  swipe && (vertical ? "touch-pan-x" : "touch-pan-y"),
  dragging && "select-none"
)

export const controlClasses = (type: "prev" | "next", vertical: boolean, classes: string) => twMerge(
  `theui-slider-control absolute z-[2] flex items-center justify-center size-12 p-2 rounded-full bg-gray-200 text-black opacity-60 cursor-pointer transition-opacity duration-300 enabled:hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed ${focusRing}`,
  vertical
    ? `left-1/2 -translate-x-1/2 ${type === "prev" ? "top-4" : "bottom-4"}`
    : `top-1/2 -translate-y-1/2 ${type === "prev" ? "start-4" : "end-4"}`,
  classes
)

export const indicatorContainerClasses = (vertical: boolean, classes: string) => twMerge(
  "theui-slider-indicators absolute z-[2] flex justify-center gap-2 pointer-events-none",
  vertical ? "inset-y-0 end-0 me-4 flex-col" : "inset-x-0 bottom-0 mb-4",
  classes
)

export const indicatorClasses = (active: boolean, vertical: boolean, classes: string, activeClasses: string) => twMerge(
  `theui-slider-indicator bg-white bg-clip-padding border-transparent rounded-sm cursor-pointer pointer-events-auto transition-opacity duration-300 ${focusRing}`,
  vertical ? "w-4 h-8 border-x-[7px]" : "w-8 h-4 border-y-[7px]",
  active ? "opacity-100" : "opacity-50 hover:opacity-80",
  classes,
  active && activeClasses
)

export const thumbnailContainerClasses = (classes: string) =>
  twMerge("theui-slider-thumbnails flex gap-2 p-1 mt-2 overflow-x-auto shrink-0", classes)

export const thumbnailClasses = (active: boolean, classes: string, activeClasses: string) => twMerge(
  "theui-slider-thumbnail shrink-0 flex items-center justify-center w-20 h-14 overflow-hidden rounded-md bg-gray-200 text-black cursor-pointer transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
  active ? "opacity-100 ring-2 ring-brand-500" : "opacity-60 hover:opacity-90",
  classes,
  active && activeClasses
)

export const timerClasses = (classes: string) => twMerge(
  "theui-slider-timer absolute top-0 inset-x-0 z-[2] h-1 bg-gray-500 mix-blend-difference opacity-70 pointer-events-none origin-left rtl:origin-right",
  classes
)

export const fractionClasses = (classes: string) => twMerge(
  "theui-slider-fraction absolute top-3 end-3 z-[2] px-2 py-0.5 rounded-md bg-black/50 text-white text-sm tabular-nums pointer-events-none",
  classes
)

export const pauseButtonClasses = (classes: string) => twMerge(
  `theui-slider-pause absolute bottom-4 start-4 z-[2] flex items-center justify-center size-8 rounded-full bg-gray-200 text-black opacity-60 cursor-pointer transition-opacity duration-300 hover:opacity-100 ${focusRing}`,
  classes
)

// The overlay lets drags and clicks through to the slides, except on its own links, buttons and fields
export const overlayClasses = (classes: string) => twMerge(
  "theui-slider-overlay absolute inset-0 z-[1] pointer-events-none [&_a,&_button,&_input,&_select,&_textarea,&_label]:pointer-events-auto",
  classes
)
