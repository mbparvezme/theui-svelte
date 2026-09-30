/**
 * Date and time helpers for DatePicker and TimePicker.
 * Dates are handled as local days: a value is the string "YYYY-MM-DD" and a
 * time is "HH:mm" in 24 hour form, so both submit in a form without surprises.
 */

/** Builds a local Date at midnight. */
export const localDate = (year: number, month: number, day: number): Date => new Date(year, month, day)

/** Today at midnight, local time. */
export const today = (): Date => {
  const now = new Date()
  return localDate(now.getFullYear(), now.getMonth(), now.getDate())
}

/** Formats a date as "YYYY-MM-DD" in local time. */
export const toISODate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

/** Reads "YYYY-MM-DD" as a local date, or `undefined` when it is not a real date. */
export const fromISODate = (value?: string): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec((value ?? "").trim())
  if (!match) return undefined
  const [, y, m, d] = match
  const date = localDate(Number(y), Number(m) - 1, Number(d))
  return date.getMonth() === Number(m) - 1 && date.getDate() === Number(d) ? date : undefined
}

export const isSameDay = (a?: Date, b?: Date): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const addDays = (date: Date, days: number): Date => localDate(date.getFullYear(), date.getMonth(), date.getDate() + days)

export const addMonths = (date: Date, months: number): Date => {
  const day = date.getDate()
  const moved = localDate(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(moved.getFullYear(), moved.getMonth() + 1, 0).getDate()
  return localDate(moved.getFullYear(), moved.getMonth(), Math.min(day, lastDay))
}

export const startOfMonth = (date: Date): Date => localDate(date.getFullYear(), date.getMonth(), 1)

export const clampDate = (date: Date, min?: Date, max?: Date): Date => {
  if (min && date < min) return min
  if (max && date > max) return max
  return date
}

/**
 * The days of the calendar grid for one month, always six weeks of seven days,
 * so the calendar does not change height from month to month.
 *
 * @param month - Any date inside the month to build.
 * @param firstDayOfWeek - 0 for Sunday, 1 for Monday, and so on.
 */
export const monthGrid = (month: Date, firstDayOfWeek = 0): Date[] => {
  const first = startOfMonth(month)
  const lead = (first.getDay() - firstDayOfWeek + 7) % 7
  const start = addDays(first, -lead)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

/** Weekday names starting at `firstDayOfWeek`, e.g. ["Sun", "Mon", …]. */
export const weekdayNames = (locale: string | undefined, firstDayOfWeek = 0, format: "short" | "narrow" | "long" = "short"): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format })
  // 4 January 1970 was a Sunday
  return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(Date.UTC(1970, 0, 4 + ((i + firstDayOfWeek) % 7)))))
}

/** Month names, e.g. ["January", "February", …]. */
export const monthNames = (locale: string | undefined, format: "long" | "short" = "long"): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { month: format })
  return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(Date.UTC(2020, i, 15))))
}

/** Reads "HH:mm" (or "H:mm") as minutes from midnight. */
export const fromTimeString = (value?: string): number | undefined => {
  const match = /^(\d{1,2}):(\d{2})/.exec((value ?? "").trim())
  if (!match) return undefined
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return undefined
  return hours * 60 + minutes
}

/** Formats minutes from midnight as "HH:mm". */
export const toTimeString = (minutes: number): string =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`

/** Formats minutes from midnight for reading, such as "2:30 PM" or "14:30". */
export const formatTime = (minutes: number, locale?: string, hour12 = false): string => {
  const date = new Date(2020, 0, 1, Math.floor(minutes / 60), minutes % 60)
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", hour12 }).format(date)
}

/** Every time from `min` to `max` in steps of `step` minutes. */
export const timeOptions = (min: number, max: number, step: number): number[] => {
  const list: number[] = []
  const gap = Math.max(1, Math.round(step))
  for (let t = min; t <= max; t += gap) list.push(t)
  return list
}
