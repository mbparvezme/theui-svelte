import type { AVATAR_SIZE, AVATAR_STATUS, ROUNDED } from "$lib/types"

const SIZES: Record<AVATAR_SIZE, string> = {
  xs: "size-6 text-[0.625rem]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-xl",
  "2xl": "size-20 text-2xl",
}

const STATUS_COLORS: Record<AVATAR_STATUS, string> = {
  online: "bg-success-500",
  offline: "bg-gray-400",
  busy: "bg-error-500",
  away: "bg-warning-400",
}

export const STATUS_TEXT: Record<AVATAR_STATUS, string> = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
}

// "Jane Cooper" → "JC", "jane" → "J"
export const initials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ""
  const first = [...words[0]][0] ?? ""
  const last = words.length > 1 ? [...words[words.length - 1]][0] ?? "" : ""
  return (first + last).toUpperCase()
}

export const avatarClasses = (size: AVATAR_SIZE, grouped: boolean): string =>
  `theui-avatar relative inline-flex shrink-0 select-none items-center justify-center bg-secondary font-semibold text-default align-middle ${SIZES[size] ?? SIZES.md}${grouped ? " ring-2 ring-[var(--background-color-primary)]" : ""}`

export const statusClasses = (status: AVATAR_STATUS, position: "top" | "bottom", rounded: ROUNDED): string => {
  // A round avatar has no corner, so the dot moves in toward the circle
  const inset = rounded === "full" ? "[--theui-avatar-status:7%]" : "[--theui-avatar-status:-4%]"
  const y = position === "top" ? "top-[var(--theui-avatar-status)]" : "bottom-[var(--theui-avatar-status)]"
  return `theui-avatar-status absolute end-[var(--theui-avatar-status)] ${y} ${inset} size-1/4 min-h-2 min-w-2 rounded-full ring-2 ring-[var(--background-color-primary)] ${STATUS_COLORS[status] ?? STATUS_COLORS.offline}`
}

export const groupClasses = (): string => "theui-avatar-group flex items-center -space-x-3 rtl:space-x-reverse"
