import type { ANIMATE_SPEED, BUTTON_SIZE, ROUNDED } from "$lib/types";
import type { Snippet } from "svelte";

export type ButtonProps = {
  children?: Snippet,
  animate?: ANIMATE_SPEED,
  ariaLabel?: string,
  rounded?: ROUNDED,
  size?: BUTTON_SIZE,
  theme?: 'default' | 'light' | 'gradient'
  color?: 'brand' | 'error' | 'info' | 'success' | 'warning',
  gradientColor?: 'brand' | 'error' | 'info' | 'success' | 'warning',
}

interface ButtonContext { group?: boolean; stacked?: boolean; }

export const buttonTheme = (CTX: ButtonContext, type: string, color: string) => {

  const defaultOutlineButtonClasses = `btn-outline ${CTX?.group ? (CTX?.stacked ? "border-x border-t last:border-b" : "border-y border-s last:border-e") : "border"}`
  const defaultGradientButtonClasses = `btn-gradient ${CTX?.group ? (CTX?.stacked ? "bg-gradient-to-r hover:bg-gradient-to-t" : "bg-gradient-to-b hover:bg-gradient-to-t") : "bg-gradient-to-r hover:bg-gradient-to-br"}`

  const themes: { [key: string]: { [key: string]: string } } = {
    default: {
      brand: "bg-brand-primary-500 hover:bg-brand-primary-600 text-on-brand-primary-500 border-black/20 focus:ring-brand-primary-500/50",
      error: "bg-error-400 hover:bg-error-500 dark:bg-error-600 text-error-50 border-black/20 focus:ring-error-500/50",
      info: "bg-info-500 hover:bg-info-600 dark:bg-info-700 text-info-50 border-black/20 dark:border-black/40 focus:ring-info-500/30",
      success: "bg-success-500 hover:bg-success-600 dark:bg-success-700 text-success-50 border-black/20 dark:border-black/40 focus:ring-success-500/30",
      warning: "bg-warning-400 hover:bg-warning-500 dark:bg-warning-500 dark:hover:bg-warning-400 text-warning-900 border-black/10 dark:border-black/20 focus:ring-warning-500/40",
    },
    outline: {
      brand: `${defaultOutlineButtonClasses} border-brand-primary-500 text-brand-primary-500 hover:bg-brand-primary-500 hover:text-on-brand-primary-500 focus:ring-brand-primary-500/30`,
      error: `${defaultOutlineButtonClasses} border-error-500 text-error-500 hover:bg-error-500 hover:text-error-50 focus:ring-error-500/30`,
      info: `${defaultOutlineButtonClasses} border-info-500 text-info-500 hover:bg-info-500 hover:text-info-50 focus:ring-info-500/30`,
      success: `${defaultOutlineButtonClasses} border-success-500 text-success-500 hover:bg-success-500 hover:text-success-50 focus:ring-success-500/30`,
      warning: `${defaultOutlineButtonClasses} border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-warning-900 focus:ring-warning-500/30`,
    },
    light: {
      brand: "bg-brand-primary-50 text-brand-primary-500 hover:bg-brand-primary-400 hover:text-on-brand-primary-500 border-black/10 focus:ring-brand-primary-300",
      error: "bg-error-100 text-error-500 hover:bg-error-400 hover:text-error-50 border-black/10 focus:ring-error-300",
      info: "bg-info-100 text-info-600 hover:bg-info-500 hover:text-info-50 border-black/10 focus:ring-info-300",
      success: "bg-success-100 text-success-600 hover:bg-success-500 hover:text-success-50 border-black/10 focus:ring-success-300",
      warning: "bg-warning-100 text-warning-600 hover:bg-warning-400 hover:text-warning-900 border-black/10 focus:ring-warning-300",
    },
    gradient: {
      brand: `${defaultGradientButtonClasses} from-brand-primary-300 via-brand-primary-400 to-brand-primary-500 text-on-brand-primary-500 border-black/10 focus:ring-brand-primary-300`,
      error: `${defaultGradientButtonClasses} from-error-400 via-error-500 to-error-600 text-error-50 border-black/10 focus:ring-error-300`,
      info: `${defaultGradientButtonClasses} from-info-400 via-info-500 to-info-600 text-info-50 border-black/10 focus:ring-info-300`,
      success: `${defaultGradientButtonClasses} from-success-400 via-success-500 to-success-600 text-success-50 border-black/10 focus:ring-success-300`,
      warning: `${defaultGradientButtonClasses} from-warning-300 via-warning-400 to-warning-600 text-warning-900 border-black/10 focus:ring-warning-300`,
    },
  }

  return themes[type] ? (themes[type][color] ? themes[type][color] : themes[type].brand) : themes.default.brand
}


export const QABTheme = (type: string, color: string) => {

  const themes: { [key: string]: { [key: string]: string } } = {
    default: {
      brand: "bg-brand-primary-500 hover:bg-brand-primary-600 text-on-brand-primary-500 focus:ring-brand-primary-500/50",
      error: "bg-error-400 hover:bg-error-500 dark:bg-error-600 text-error-50 focus:ring-error-500/50",
      info: "bg-info-500 hover:bg-info-600 dark:bg-info-700 text-info-50 focus:ring-info-500/30",
      success: "bg-success-500 hover:bg-success-600 dark:bg-success-700 text-success-50 focus:ring-success-500/30",
      warning: "bg-warning-400 hover:bg-warning-500 dark:bg-warning-500 dark:hover:bg-warning-400 text-warning-900 dark:focus:ring-warning-500/40",
    },
    light: {
      brand: "bg-brand-primary-50 text-brand-primary-500 hover:bg-brand-primary-400 hover:text-on-brand-primary-500 focus:ring-brand-primary-300",
      error: "bg-error-100 text-error-500 hover:bg-error-400 hover:text-error-50 focus:ring-error-300",
      info: "bg-info-100 text-info-600 hover:bg-info-500 hover:text-info-50 focus:ring-info-300",
      success: "bg-success-100 text-success-600 hover:bg-success-500 hover:text-success-50 focus:ring-success-300",
      warning: "bg-warning-100 text-warning-600 hover:bg-warning-400 hover:text-warning-900 focus:ring-warning-300",
    },
    gradient: {
      brand: `bg-gradient-to-r hover:bg-gradient-to-br from-brand-primary-300 via-brand-primary-400 to-brand-primary-500 text-on-brand-primary-500 focus:ring-brand-primary-300`,
      error: `bg-gradient-to-r hover:bg-gradient-to-br from-error-400 via-error-500 to-error-600 text-error-50 focus:ring-error-300`,
      info: `bg-gradient-to-r hover:bg-gradient-to-br from-info-400 via-info-500 to-info-600 text-info-50 focus:ring-info-300`,
      success: `bg-gradient-to-r hover:bg-gradient-to-br from-success-400 via-success-500 to-success-600 text-success-50 focus:ring-success-300`,
      warning: `bg-gradient-to-r hover:bg-gradient-to-br from-warning-300 via-warning-400 to-warning-600 text-warning-900 focus:ring-warning-300`,
    },
  }
  // console.log(type, color, themes[type][color])
  // console.log(themes[type] ? (themes[type][color] || themes[type]["brand"]) : themes["default"]["brand"])

  return themes[type] ? (themes[type][color] || themes[type]["brand"]) : themes["default"]["brand"]
}
