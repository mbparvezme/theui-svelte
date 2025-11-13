import type { ANIMATE_SPEED, BUTTON_SIZE, ROUNDED } from "$lib/types.ts";
import type { Snippet } from "svelte";

export type ButtonProps = {
  children?: Snippet,
  animate?: ANIMATE_SPEED,
  ariaLabel?: string,
  rounded?: ROUNDED,
  size?: BUTTON_SIZE,
  theme?: 'default' | 'soft' | 'gradient'
  color?: 'brand' | 'error' | 'info' | 'success' | 'warning',
  gradientColor?: 'brand' | 'error' | 'info' | 'success' | 'warning',
}

interface ButtonContext { group?: boolean; stacked?: boolean; }

export const buttonTheme = (CTX: ButtonContext, type: string, color: string) => {

  const defaultOutlineButtonClasses = `btn-outline ${CTX?.group ? (CTX?.stacked ? "border-x border-t last:border-b" : "border-y border-s last:border-e") : "border"}`
  const defaultGradientButtonClasses = `btn-gradient ${CTX?.group ? (CTX?.stacked ? "bg-gradient-to-r hover:bg-gradient-to-t" : "bg-gradient-to-b hover:bg-gradient-to-t") : "bg-gradient-to-r hover:bg-gradient-to-br"}`

  const themes: { [key: string]: { [key: string]: string } } = {
    default: {
      brand: "bg-brand-primary-500 dark:bg-brand-primary-700 text-on-brand-primary border-black/20 focus:ring-brand-primary-500/50 filter-none hover:brightness-90 dark:hover:brightness-110",
      error: "bg-error-500 dark:bg-error-600 text-error-50 border-black/20 focus:ring-error-500/50 filter-none hover:brightness-90 dark:hover:brightness-110",
      info: "bg-info-500 dark:bg-info-700 text-info-50 border-black/20 dark:border-black/40 focus:ring-info-500/30 filter-none hover:brightness-90 dark:hover:brightness-110",
      success: "bg-success-500 dark:bg-success-700 text-success-50 border-black/20 dark:border-black/40 focus:ring-success-500/30 filter-none hover:brightness-90 dark:hover:brightness-110",
      warning: "bg-warning-400 dark:bg-warning-500 text-warning-950 border-black/10 dark:border-black/20 focus:ring-warning-500/40 filter-none hover:brightness-90 dark:hover:brightness-110",
    },
    outline: {
      brand: `${defaultOutlineButtonClasses} border-brand-primary-500 text-brand-primary-500 focus:ring-brand-primary-500/30 filter-none hover:brightness-90 dark:hover:brightness-110`,
      error: `${defaultOutlineButtonClasses} border-error-500 text-error-500 focus:ring-error-500/30 filter-none hover:brightness-90 dark:hover:brightness-110`,
      info: `${defaultOutlineButtonClasses} border-info-500 text-info-500 focus:ring-info-500/30 filter-none hover:brightness-90 dark:hover:brightness-110`,
      success: `${defaultOutlineButtonClasses} border-success-500 text-success-500 focus:ring-success-500/30 filter-none hover:brightness-90 dark:hover:brightness-110`,
      warning: `${defaultOutlineButtonClasses} border-warning-500 text-warning-500 focus:ring-warning-500/30 filter-none hover:brightness-90 dark:hover:brightness-110`,
    },
    soft: {
      brand: "bg-brand-primary-100 text-brand-primary-600 border-black/10 focus:ring-brand-primary-300 hover:bg-brand-primary-500 hover:text-on-brand-primary",
      error: "bg-error-100 text-error-600 border-black/10 focus:ring-error-300 hover:bg-error-500 hover:text-error-50",
      info: "bg-info-100 text-info-600 border-black/10 focus:ring-info-300 hover:bg-info-500 hover:text-info-50",
      success: "bg-success-100 text-success-600 border-black/10 focus:ring-success-300 hover:bg-success-500 hover:text-success-50",
      warning: "bg-warning-100 text-warning-700 border-black/10 focus:ring-warning-300 hover:bg-warning-400 hover:text-warning-950",
    },
    gradient: {
      brand: `${defaultGradientButtonClasses} from-brand-primary-300 via-brand-primary-400 to-brand-primary-500 text-on-brand-primary border-black/10 focus:ring-brand-primary-300`,
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
      brand: "bg-brand-primary-500 text-on-brand-primary focus:ring-brand-primary-500/50 filter-none hover:brightness-90 dark:hover:brightness-110",
      error: "bg-error-400 dark:bg-error-600 text-error-50 focus:ring-error-500/50 filter-none hover:brightness-90 dark:hover:brightness-110",
      info: "bg-info-500 dark:bg-info-700 text-info-50 focus:ring-info-500/30 filter-none hover:brightness-90 dark:hover:brightness-110",
      success: "bg-success-500 dark:bg-success-700 text-success-50 focus:ring-success-500/30 filter-none hover:brightness-90 dark:hover:brightness-110",
      warning: "bg-warning-400 dark:bg-warning-500 text-warning-900 dark:focus:ring-warning-500/40 filter-none hover:brightness-90 dark:hover:brightness-110",
    },
    soft: {
      brand: "bg-brand-primary-50 text-brand-primary-500 focus:ring-brand-primary-300 hover:bg-brand-primary-400 hover:text-on-brand-primary",
      error: "bg-error-100 text-error-500 focus:ring-error-300 hover:bg-error-400 hover:text-error-50",
      info: "bg-info-100 text-info-600 focus:ring-info-300 hover:bg-info-500 hover:text-info-50",
      success: "bg-success-100 text-success-600 focus:ring-success-300 hover:bg-success-500 hover:text-success-50",
      warning: "bg-warning-100 text-warning-600 focus:ring-warning-300 hover:bg-warning-400 hover:text-warning-900",
    },
    gradient: {
      brand: `bg-gradient-to-r hover:bg-gradient-to-br from-brand-primary-300 via-brand-primary-400 to-brand-primary-500 text-on-brand-primary focus:ring-brand-primary-300`,
      error: `bg-gradient-to-r hover:bg-gradient-to-br from-error-400 via-error-500 to-error-600 text-error-50 focus:ring-error-300`,
      info: `bg-gradient-to-r hover:bg-gradient-to-br from-info-400 via-info-500 to-info-600 text-info-50 focus:ring-info-300`,
      success: `bg-gradient-to-r hover:bg-gradient-to-br from-success-400 via-success-500 to-success-600 text-success-50 focus:ring-success-300`,
      warning: `bg-gradient-to-r hover:bg-gradient-to-br from-warning-300 via-warning-400 to-warning-600 text-warning-900 focus:ring-warning-300`,
    },
  }

  return themes[type] ? (themes[type][color] || themes[type]["brand"]) : themes["default"]["brand"]
}
