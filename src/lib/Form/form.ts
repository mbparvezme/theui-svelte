import type {INPUT_CONFIG, INPUT_SIZE} from "$lib/types"
export type INPUT_CATEGORY = 'text' | 'file' | 'checkbox' | 'radio' | 'select'
import { twMerge } from "tailwind-merge"
import { animationClass, roundedClass } from "$lib/function"

/**
 * CSS class keys shared across all form inputs. Each type maps to a semantic
 * BEM-style class and each size maps to a size-variant modifier.
 */
export const theuiInputClass: {
  'type': { [type in INPUT_CATEGORY]: string }
  'size': { [type in INPUT_SIZE]: string }
} = {
  type: {
    text: "theui-input",
    file: "theui-file-input",
    checkbox: "theui-checkbox",
    radio: "theui-radio-button",
    select: "theui-select"
  },
  size: {
    sm: "theui-input-sm",
    md: "theui-input-md",
    lg: "theui-input-lg",
    xl: "theui-input-xl"
  }
}

/**
 * Horizontal padding and inset offset for floating labels, keyed by input size.
 */
export const labelSizeClass: { [size in INPUT_SIZE]: string } = {
  sm: "px-1 start-2",
  md: "px-2 start-3",
  lg: "px-3 start-4",
  xl: "px-4 start-5"
}

/**
 * Size-specific padding and text classes for every input category.
 * Only `default` (text-based inputs) splits by `flat` / `nonFlat`;
 * `select`, `file`, and `group` use a flat size map.
 */
export const inputTypeSizeClasses: {
  default: { [type in 'flat' | 'nonFlat']: { [size in INPUT_SIZE]: string } };
  select: { [size in INPUT_SIZE]: string };
  file: { [size in INPUT_SIZE]: string };
  group: { [size in INPUT_SIZE]: string };
} = {
  default: {
    flat: {
      sm: "px-0 py-1 text-sm",
      md: "px-0 py-2",
      lg: "px-0 py-3 text-lg",
      xl: "px-0 py-4 text-xl"
    },
    nonFlat: {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2",
      lg: "px-5 py-3 text-lg",
      xl: "px-6 py-4 text-xl"
    }
  },
  select: {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg",
    xl: "px-6 py-4 text-xl"
  },
  file: {
    sm: "file:px-4 file:py-1 file:text-sm",
    md: "file:px-6 file:py-2",
    lg: "file:px-6 file:py-3 file:text-lg",
    xl: "file:px-8 file:py-4 file:text-xl"
  },
  group: {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
    xl: "h-7 w-7"
  },
}

/** Size-variant classes for the toggle (switch) component. */
const toggleSizes: Record<INPUT_SIZE, string> = {
  sm: "h-4 w-6 after:w-3 after:h-3 px-0.5 checked:after:translate-x-2",
  md: "h-5 w-8 after:w-3 after:h-3 px-1 checked:after:translate-x-3",
  lg: "h-6 w-10 after:w-4 after:h-4 px-1 checked:after:translate-x-4",
  xl: "h-7 w-12 after:w-5 after:h-5 px-1 checked:after:translate-x-5"
}

/**
 * Generates the CSS class for the outer wrapper of a text/select/file input.
 *
 * @param config - Form-scoped configuration (size, variant, reset).
 * @param isFile - When `true`, forces `gap-2` regardless of variant (file inputs
 *   always need the gap for their label + button layout).
 * @returns The container class string, or `"theui-input-container"` alone when `reset` is set.
 */
export const inputContainerClass = (
  config: INPUT_CONFIG,
  isFile: boolean = false
): string => {
  const customClass = `flex flex-col ${config?.variant != "flat" || isFile ? "gap-2" : ""}`
  return `theui-input-container ${config?.reset ? "" : customClass}`
}


/**
 * Generates the CSS class for the outer wrapper of a radio/checkbox group.
 * Applies disabled/readonly cursor and opacity styles from the element attributes.
 *
 * @param config - Form-scoped configuration (size, variant, reset).
 * @param attr - The input element's HTML attributes (reads `disabled` and `readonly`).
 * @returns The container class string, or `"theui-input-container"` alone when `reset` is set.
 */
export const groupInputContainerClass = (
  config: INPUT_CONFIG,
  attr: Record<string, unknown> = {},
): string => {
  if(config?.reset) return "theui-input-container"
  return `theui-input-container flex gap-2 items-center ${attr?.disabled || attr?.readonly ? "cursor-not-allowed opacity-50 select-none pointer-events-none" : ""}`
}


/**
 * Returns a memoized wrapper around a pure string-producing function.
 * Caches results under the key built by `keyOf` with a bounded FIFO eviction
 * so memory stays constant under re-renders.
 *
 * @param fn - A pure function that returns a string.
 * @param keyOf - Builds the cache key from only the values `fn` reads. Keep it to
 *   primitives: the input's props can hold functions or circular objects.
 * @param maxSize - Maximum cache entries before the oldest is evicted (default 64).
 */
function memoize<TArgs extends unknown[]>(
  fn: (...args: TArgs) => string,
  keyOf: (...args: TArgs) => string,
  maxSize = 64,
): (...args: TArgs) => string {
  const cache = new Map<string, string>()
  return (...args: TArgs): string => {
    const key = keyOf(...args)
    const cached = cache.get(key)
    if (cached !== undefined) return cached
    const result = fn(...args)
    if (cache.size >= maxSize) {
      const first = cache.keys().next().value
      if (first !== undefined) cache.delete(first)
    }
    cache.set(key, result)
    return result
  }
}

/** Base structural classes for each input category (layout, cursor, file-button chrome). */
const INPUT_CLASS_MAP: Record<INPUT_CATEGORY, string> = {
  text: "block w-full",
  select: "block min-w-[10em] w-full",
  file: "file:me-4 file:bg-secondary file:cursor-pointer file:text-gray-600 dark:file:text-gray-400",
  checkbox: "bg-gray-100 dark:bg-gray-800 cursor-pointer checked:bg-brand-500",
  radio: "bg-gray-100 dark:bg-gray-800 cursor-pointer checked:bg-brand-500",
}


/**
 * Generates the complete set of CSS classes for an input element based on configuration, attributes, and input type.
 *
 * @param config - Input configuration object (e.g., size, reset state, and styling preferences).
 * @param attr - Additional attributes for the input element (e.g., `class`, `disabled`, `readonly`).
 * @param type - Type of the input element (e.g., `text`, `file`, `checkbox`, `radio`, `select`). Defaults to `text`.
 * @returns A string containing the computed classes for the input element.
 */
export const inputClasses = memoize((config: INPUT_CONFIG, attr: Record<string, unknown> = {}, type: INPUT_CATEGORY = "text"): string => {
  const baseClass = `theui-input ${theuiInputClass['type'][type]} ${theuiInputClass['size'][config?.size || "md"]}`
  if (config?.reset) return twMerge(baseClass, attr?.class as string)

  const isGroup = type === "checkbox" || type === "radio"
  const commonClasses = `outline-hidden ${inputSizeClasses(config, type)} ${commonInputTheme(config, type)} ${attributesClasses(attr)}`

  const animPart = animationClass(config?.animationSpeed)
  const floatingPart = !isGroup && config?.floatingLabel ? "peer placeholder-transparent" : ""
  const filePart = type === "file"
    ? `${roundedClass(config?.rounded, "all", "fileButton")}${roundedClass(config?.rounded)}`
    : ""
  const typeClass = `${INPUT_CLASS_MAP[type]} ${floatingPart} ${animPart} ${filePart}`

  return twMerge(baseClass, commonClasses, typeClass, attr?.class as string)
}, (config, attr = {}, type = "text") => JSON.stringify([
  type, config?.size, config?.variant, config?.rounded, config?.animationSpeed, config?.floatingLabel, config?.reset,
  attr?.class ?? "", !!attr?.disabled, !!attr?.readonly,
]))

/**
 * Generates CSS classes for a label element based on form configuration.
 *
 * @param config - Form-scoped configuration (floating label state, size, variant, animation).
 * @param classes - Consumer-provided class string to merge via `twMerge`.
 * @returns The computed label class string, or raw `classes` when `reset` is set.
 */
export const labelClasses = memoize((config: INPUT_CONFIG, classes: string): string => {
  const baseClasses = `font-medium flex flex-col text-base text-gray-700 dark:text-gray-300`
  const floatingLabelClasses = config?.floatingLabel
      ? `peer-placeholder-shown:text-base transform cursor-text absolute top-0 peer-placeholder-shown:top-1/2 peer-focus:top-0 -translate-y-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-1/2 peer-placeholder-shown:text-gray-500 peer-focus:text-xs text-xs peer-focus:text-default ${animationClass(config?.animationSpeed)} ${config?.variant !== "flat" ? labelSizeClass[config?.size as INPUT_SIZE] : "start-0"} ${config?.variant === "bordered" ? "bg-primary" : ""}`
    : ""

  return config?.reset ? classes : twMerge(baseClasses, floatingLabelClasses, classes)
}, (config, classes) => JSON.stringify([
  config?.floatingLabel, config?.animationSpeed, config?.variant, config?.size, config?.reset, classes,
]))

// Helper functions

/**
 * Determines size-specific classes for an input based on its category and configuration.
 *
 * @param config - Configuration object specifying size and variant.
 * @param type - Input category (e.g., "text", "file", "checkbox", "radio"). Defaults to "text".
 * @returns A string representing the appropriate size classes for the input.
 */
const inputSizeClasses = (config: INPUT_CONFIG, type: INPUT_CATEGORY = "text"): string => {
  const inputType = ["radio", "checkbox"].includes(type) ? "group" : type === "file" ? "file" : type === "select" ? "select" : "default"
  const sizeKey = config.size ?? "md"
  const flatStat = config.variant === "flat" ? "flat" : "nonFlat"

  return inputType === "default"
    ? inputTypeSizeClasses.default[flatStat][sizeKey]
    : inputTypeSizeClasses[inputType as "select" | "file" | "group"][sizeKey]
}

/**
 * Generates theme-specific classes for an input element based on its type and configuration.
 *
 * @param config - Configuration object specifying the variant and rounding style.
 * @param type - Input category (e.g., "text", "file", "radio", "select").
 * @returns A string representing theme-specific classes.
 */
const commonInputTheme = (config: INPUT_CONFIG, type: INPUT_CATEGORY): string => {
  const borderTheme = "border-gray-300 dark:border-gray-600 focus:border-brand-500 ring-transparent focus:ring-brand-500 ring-offset-0"
  const themes: Record<NonNullable<INPUT_CONFIG['variant']>, string> = {
    bordered: `border bg-transparent ${borderTheme}`,
    flat: type !== "file"
      ? `bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:border-brand-500 ring-transparent`
      : `bg-transparent [type='file']:focus:ring-0 border-gray-300 dark:border-gray-600 focus:border-brand-500 ring-transparent`
  }

  const themeClasses = themes[config.variant ?? "bordered"]
  const rounded = type === "radio" ? roundedClass("full") : config.variant !== "flat" ? roundedClass(config.rounded) : ""

  return twMerge(themeClasses, rounded)
}

/**
 * Applies classes for `disabled` or `readonly` states to an input element.
 * 
 * @param attr - Attributes object to determine the state (e.g., `disabled` or `readonly`).
 * @returns A string of state-specific classes or an empty string if no state applies.
 */
const attributesClasses = (attr: Record<string, unknown> = {}): string =>
  attr?.disabled
    ? "disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-75 disabled:select-none"
    : attr?.readonly
      ? "read-only:bg-gray-100 dark:read-only:bg-gray-800 read-only:pointer-events-none read-only:opacity-75"
      : ""

/**
 * Classes for the `<input type="range">` of the Range component.
 * The track, its filled part and the thumb live in browser specific pseudo
 * elements, so each one is styled through an arbitrary variant instead of CSS.
 * Sizes come from the `--theui-range-track` and `--theui-range-thumb` variables
 * and the filled part from `--theui-range-percent`, all set by the component.
 *
 * @returns The class string for the range input.
 */
export const rangeInputClasses = (): string => [
  "appearance-none w-full border-0 bg-transparent p-0 h-[var(--theui-range-thumb)] focus-visible:outline-none",
  // Track (Chrome, Edge, Safari): the colour fills up to the value
  "[&::-webkit-slider-runnable-track]:h-[var(--theui-range-track)] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-200 dark:[&::-webkit-slider-runnable-track]:bg-gray-700",
  "[&::-webkit-slider-runnable-track]:bg-[image:linear-gradient(to_right,currentColor_var(--theui-range-percent),transparent_var(--theui-range-percent))]",
  "rtl:[&::-webkit-slider-runnable-track]:bg-[image:linear-gradient(to_left,currentColor_var(--theui-range-percent),transparent_var(--theui-range-percent))]",
  // Track (Firefox): it has its own element for the filled part
  "[&::-moz-range-track]:h-[var(--theui-range-track)] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-gray-200 dark:[&::-moz-range-track]:bg-gray-700",
  "[&::-moz-range-progress]:h-[var(--theui-range-track)] [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-current",
  // Thumb
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-[var(--theui-range-thumb)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--background-color-primary)] [&::-webkit-slider-thumb]:bg-current [&::-webkit-slider-thumb]:shadow-sm",
  "[&::-webkit-slider-thumb]:mt-[calc((var(--theui-range-track)-var(--theui-range-thumb))/2)]",
  "[&::-moz-range-thumb]:size-[var(--theui-range-thumb)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--background-color-primary)] [&::-moz-range-thumb]:bg-current [&::-moz-range-thumb]:shadow-sm",
  // Focus ring sits on the thumb, not on the whole control
  "focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-moz-range-thumb]:outline-2 focus-visible:[&::-moz-range-thumb]:outline-offset-2",
].join(" ")


/**
 * Checks a file against the `accept` attribute of a file input.
 *
 * @param file - The file to test.
 * @param accept - A comma separated list like `"image/*,.pdf,text/csv"`.
 * @returns `true` when the file matches one of the entries, or when `accept` is empty.
 */
export const matchesAccept = (file: File, accept?: string): boolean => {
  const rules = (accept ?? "").split(",").map(r => r.trim().toLowerCase()).filter(Boolean)
  if (!rules.length) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return rules.some(rule => {
    if (rule.startsWith(".")) return name.endsWith(rule)
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1))
    return type === rule
  })
}


/**
 * Formats a file size in bytes as a short human readable string.
 *
 * @param bytes - The size in bytes.
 * @returns A string such as `"0 B"`, `"12.4 KB"` or `"3.1 MB"`.
 */
export const fileSize = (bytes: number): string => {
  if (!bytes) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, i)
  return `${i === 0 ? value : value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`
}


/**
 * Returns the Tailwind classes for a toggle (switch) of the given size.
 *
 * @param size - One of `"sm"`, `"md"`, `"lg"`, `"xl"`.
 * @returns The corresponding toggle size class string.
 */
export const getToggleSize = (size: INPUT_SIZE): string => toggleSizes[size]
