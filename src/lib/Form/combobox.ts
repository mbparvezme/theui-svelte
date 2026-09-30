import type { COMBOBOX_ITEM, COMBOBOX_OPTION } from "$lib/types"

/** Fills in the missing parts of an item, so the component works with one shape. */
export const toOption = (item: COMBOBOX_ITEM): COMBOBOX_OPTION => {
  if (typeof item === "string" || typeof item === "number") {
    return { value: item, text: String(item), disabled: false }
  }
  const value = item?.value !== undefined ? item.value : item?.text
  return {
    value,
    text: item?.text ?? (value === undefined || value === null ? "" : String(value)),
    disabled: !!item?.disabled,
    group: item?.group,
  }
}

export const toOptions = (items: COMBOBOX_ITEM[] = []): COMBOBOX_OPTION[] => items.map(toOption)

/** Matches an option when the text contains the query, ignoring case. */
export const defaultFilter = (option: COMBOBOX_OPTION, query: string): boolean =>
  option.text.toLowerCase().includes(query.trim().toLowerCase())

/** Compares two option values. Numbers and strings match when they read the same. */
export const sameValue = (a: unknown, b: unknown): boolean => {
  if (a === b) return true
  if (a === null || a === undefined || b === null || b === undefined) return false
  if (typeof a === "object" || typeof b === "object") return false
  return String(a) === String(b)
}

/** Keeps the options in their original order while putting each group together. */
export const groupOptions = (options: COMBOBOX_OPTION[]): { group?: string; options: COMBOBOX_OPTION[] }[] => {
  const groups: { group?: string; options: COMBOBOX_OPTION[] }[] = []
  for (const option of options) {
    const found = groups.find(g => g.group === option.group)
    if (found) found.options.push(option)
    else groups.push({ group: option.group, options: [option] })
  }
  return groups
}
