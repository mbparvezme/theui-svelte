import type {NOTIFY_CONFIG, NOTIFICATION_TYPE} from "$lib/types"
import {generateToken} from "$lib/function"

type NOTIFICATION_DATA_TYPE = { msg: string, type: NOTIFICATION_TYPE, CONFIG: NOTIFY_CONFIG & { id: string } }

export const ST_ACTIVE_ACCORDIONS: { value: string[]} = $state({ value: [""]})
export const ST_MOBILE_NAV: { value: string[]} = $state({ value: [] })
export const ST_NOTIFICATIONS: { value: NOTIFICATION_DATA_TYPE[]} = $state({ value: [] })

export const selectedTab: { value: string | null } = $state({ value: null })
export const selectedPanel: { value: string | null } = $state({ value: null })

// export const ST_SLIDER: { slides: HTMLElement[], activeSlide: HTMLElement|null, previousSlide: string, nextSlide: string }[] = $state([])

export const ST_SLIDER: Record<string, {
  slides: HTMLElement[],
  activeSlide: HTMLElement | null,
  previousSlide: string,
  nextSlide: string
}> = $state({});


export const notify = (msg: string, type: NOTIFICATION_TYPE = "error", config: NOTIFY_CONFIG = {}): string => {
  const defaultConfig: NOTIFY_CONFIG = { removeOnClick: true, removeAfter: 4000, rounded: "md", theme: "default", variant: "card" };
  const C: NOTIFY_CONFIG & { id: string } = { ...defaultConfig, ...config, id: generateToken() };

  ST_NOTIFICATIONS.value.push({ msg, type, CONFIG: C });

  if (C.removeAfter !== 0) {
    setTimeout(() => removeNotification(C.id), C.removeAfter);
  }
  return C.id;
}

export const removeNotification = (id: string) => {
  ST_NOTIFICATIONS.value = ST_NOTIFICATIONS.value.filter((n: NOTIFICATION_DATA_TYPE) => n.CONFIG.id !== id);
}