import type { NOTIFICATION_DATA_TYPE } from "$lib/types"
import { SvelteSet } from "svelte/reactivity"

export const ST_ACTIVE_ACCORDIONS: { value: Record<string, string[]> } = $state({ value: {} })
// export const ST_MOBILE_NAV: { value: string[]} = $state({ value: [] })
// SvelteSet: a plain Set is not tracked by $state, so the mobile menu would never open
export const ST_MOBILE_NAV: { value: SvelteSet<string> } = $state({ value: new SvelteSet() })
export const ST_NOTIFICATIONS: { value: NOTIFICATION_DATA_TYPE[]} = $state({ value: [] })

// export const selectedTab: { value: string | null } = $state({ value: null })
// export const selectedPanel: { value: string | null } = $state({ value: null })

// Ids of the open modals, newest last, so Escape only closes the top one.
// A plain array on purpose: nothing renders from it, and a $state array that the
// Modal effect reads and writes makes that effect re-run forever.
export const ST_OPEN_MODALS: string[] = []

export const registerModal = (id: string) => {
  if (!ST_OPEN_MODALS.includes(id)) ST_OPEN_MODALS.push(id)
}

export const unregisterModal = (id: string) => {
  const i = ST_OPEN_MODALS.indexOf(id)
  // splice(-1, 1) would remove another modal when this one is not in the list
  if (i !== -1) ST_OPEN_MODALS.splice(i, 1)
}

// export const ST_SLIDER: Record<string, {
//   slides: HTMLElement[],
//   activeSlide: HTMLElement | null,
//   previousSlide: string | null,
//   nextSlide: string | null
// }> = $state({});