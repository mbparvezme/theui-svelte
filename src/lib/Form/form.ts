import type {INPUT_CONFIG, INPUT_SIZE} from "$lib/types"
export type INPUT_CATEGORY = 'text' | 'file' | 'checkbox' | 'radio' | 'select'
import { twMerge } from "tailwind-merge"
import { animationClass, roundedClass } from "$lib/function"


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

export const labelSizeClass: { [size in INPUT_SIZE]: string } = {
  sm: "px-1 start-2",
  md: "px-2 start-3",
  lg: "px-3 start-4",
  xl: "px-4 start-5"
}

export const inputTypeSizeClasses: {
  [key in 'default' | 'file' | 'group']: key extends 'default'
  ? { [type in 'flat' | 'nonFlat']: { [size in INPUT_SIZE]: string } }
  : { [size in INPUT_SIZE]: string };
} = {
  default: {
    flat: {
      sm: "px-0 py-2 text-sm",
      md: "px-0 py-3",
      lg: "px-0 py-4 text-xl",
      xl: "px-0 py-5 text-2xl",
    },
    nonFlat: {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3",
      lg: "px-5 py-4 text-xl",
      xl: "px-6 py-5 text-2xl",
    }
  },
  file: {
    sm: "file:px-4 file:py-2 file:text-sm",
    md: "file:px-6 file:py-3",
    lg: "file:px-6 file:py-4 file:text-xl",
    xl: "file:px-8 file:py-5 file:text-2xl",
  },
  group: {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  },
}

const toggleSizes: Record<Exclude<INPUT_CONFIG['size'], undefined>, string> = {
  sm: "h-4 w-6 after:w-3 after:h-3 px-0.5 checked:after:translate-x-2",
  md: "h-5 w-8 after:w-3 after:h-3 px-1 checked:after:translate-x-3",
  lg: "h-6 w-10 after:w-4 after:h-4 px-1 checked:after:translate-x-4",
  xl: "h-7 w-12 after:w-5 after:h-5 px-1 checked:after:translate-x-5"
}


/**
 * Generates the base class for an input container based on configuration, attributes, and input type.
 *
 * @param config - Configuration object (e.g., size, variant, reset state).
 * @param attr - Additional attributes (e.g., `disabled`, `readonly`, `class`).
 * @param type - Input type (`default` for text/select, `group` for radio/checkbox). Default is `default`.
 * @returns A string with the computed class names for the input container.
 */
export const inputContainerClass = (
  config: INPUT_CONFIG,
  attr: Record<string, unknown> = {},
  type: 'default' | 'group' = "default"
): string => {
  const customClass = type === "group" ?
    `cursor-pointer ${attr?.disabled && `cursor-not-allowed opacity-50 select-none ${attr?.readonly && "pointer-events-none"}`}` :
    `flex flex-col ${config?.variant != "flat" ? "gap-2" : ""}`
  return `theui-input-container ${config?.reset ? "" : twMerge(customClass, attr.class as string)}`
}


/**
 * Generates the complete set of CSS classes for an input element based on configuration, attributes, and input type.
 *
 * @param config - Input configuration object (e.g., size, reset state, and styling preferences).
 * @param attr - Additional attributes for the input element (e.g., `class`, `disabled`, `readonly`).
 * @param type - Type of the input element (e.g., `text`, `file`, `checkbox`, `radio`, `select`). Defaults to `text`.
 * @returns A string containing the computed classes for the input element.
 */
export const inputClasses = (config: INPUT_CONFIG, attr: Record<string, unknown> = {}, type: INPUT_CATEGORY = "text"): string => {
  const baseClass = `theui-input ${theuiInputClass['type'][type]} ${theuiInputClass['size'][config?.size || "md"]}`
  if (config?.reset) return baseClass

  const commonClasses = `${inputSizeClasses(config, type)} ${commonInputTheme(config, type)}${attributesClasses(attr)}`
  const groupClasses = `bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-200/20 text-brand-primary-500 focus-within:ring-brand-primary-500 !ring-offset-primary ${animationClass(config?.animate)}`

  const typeSpecificClasses: Record<INPUT_CATEGORY, () => string> = {
    text: () => defaultInputClasses(config),
    select: () => defaultInputClasses(config),
    file: () => fileInputClasses(config),
    checkbox: () => groupClasses,
    radio: () => groupClasses,
  }

  return twMerge(baseClass, commonClasses, typeSpecificClasses[type]?.(), attr?.class as string)
}


/**
 * Generates CSS classes for a label element based on configuration and attributes.
 *
 * @param config - Configuration object including label type, size, floating label state, and animation options.
 * @param attr - Additional attributes like `class` for custom styling.
 * @returns A string containing the computed classes for the label element.
 */
export const labelClasses = (config: INPUT_CONFIG & { type: INPUT_CATEGORY }, attr: Record<string, unknown> = {}): string => {
  const baseClasses = `font-medium inline-flex text-sm`
  const floatingLabelClasses = config?.floatingLabel
    ? `peer-placeholder-shown:text-base transform cursor-text absolute top-0 peer-placeholder-shown:top-1/2 peer-focus:top-0 -translate-y-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-1/2 peer-placeholder-shown:text-gray-500 peer-focus:text-xs text-xs peer-focus:text-default ${animationClass(config?.animate)}
      ${config?.variant !== "flat" ? labelSizeClass[config?.size as INPUT_SIZE] : "start-0"}
      ${config?.variant === "bordered" ? "bg-primary" : ""}`
    : ""

  return config?.reset ? (attr?.class as string ?? "") : twMerge(baseClasses, floatingLabelClasses, attr?.class as string)
}


// Helper functions


/**
 * Determines size-specific classes for an input based on its category and configuration.
 *
 * @param config - Configuration object specifying size and variant.
 * @param type - Input category (e.g., "text", "file", "checkbox", "radio"). Defaults to "text".
 * @returns A string representing the appropriate size classes for the input.
 */
const inputSizeClasses = (config: INPUT_CONFIG, type: INPUT_CATEGORY = "text"): string => {
  const inputType = ["radio", "checkbox"].includes(type) ? "group" : type === "file" ? "file" : "default"
  const sizeKey = config.size ?? "md"

  return inputType === "default"
    ? inputTypeSizeClasses.default[config.variant === "flat" ? "flat" : "nonFlat"][sizeKey]
    : inputTypeSizeClasses[inputType as "file" | "group"][sizeKey]
}


/**
 * Generates theme-specific classes for an input element based on its type and configuration.
 *
 * @param config - Configuration object specifying the variant and rounding style.
 * @param type - Input category (e.g., "text", "file", "radio", "select").
 * @returns A string representing theme-specific classes.
 */
const commonInputTheme = (config: INPUT_CONFIG, type: INPUT_CATEGORY): string => {
  const themes: Record<string, string> = {
    bordered: `border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-brand-primary-500 focus:border-brand-primary-500 ${type === "select" ? "dark:bg-primary" : "bg-transparent"}`,
    // filled: "border-0 focus:ring-1 focus:ring-brand-primary-500 focus:border-brand-primary-500 bg-gray-100 dark:bg-gray-900",
    flat: type !== "file"
      ? `border-0 border-b-2 border-gray-300 focus:border-brand-primary-500 dark:border-gray-700 bg-transparent focus:ring-0 ${type === "select" ? "dark:bg-primary" : "bg-transparent"}`
      : "border-0 [type='file']:focus:outline-none ring-0 [type='file']:focus:outline-none focus:ring-0",
  }

  const themeClasses = themes[config.variant ?? "bordered"]
  const rounded = type === "radio" ? roundedClass("full") : config.variant !== "flat" ? roundedClass(config.rounded) : ""

  return `${themeClasses}${rounded}`
}


/**
 * Generates default classes for an input element, including animation and optional floating label styling.
 * 
 * @param config - Configuration object determining animation and floating label behavior.
 * @returns A string of base classes for styling the input element.
 */
const defaultInputClasses = (config: INPUT_CONFIG): string =>
  `outline-transparent ring-transparent block w-full ${config?.floatingLabel ? "peer placeholder-transparent" : ""
  } ${animationClass(config?.animate)}`


/**
 * Applies classes for `disabled` or `readonly` states to an input element.
 * 
 * @param attr - Attributes object to determine the state (e.g., `disabled` or `readonly`).
 * @returns A string of state-specific classes or an empty string if no state applies.
 */
const attributesClasses = (attr: Record<string, unknown> = {}): string =>
  attr?.disabled
    ? " disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:select-none"
    : attr?.readonly
      ? " read-only:bg-gray-100 dark:read-only:bg-gray-800 read-only:pointer-events-none read-only:opacity-50"
      : "";


/**
 * Generates classes for styling a file input element, including colors, spacing, and rounded corners.
 * 
 * @param config - Configuration object for customizing file button and input styles.
 * @returns A string containing file input-specific classes.
 */
const fileInputClasses = (config: INPUT_CONFIG): string =>
  `file:mr-4 file:bg-secondary file:cursor-pointer cursor-pointer file:border-0 ${roundedClass(config?.rounded, "all", "fileButton")
  }${roundedClass(config?.rounded)}`;



export const getToggleSize = (size: INPUT_SIZE): string => toggleSizes[size]