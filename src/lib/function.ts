export type ANIMATION_PROPERTY_TYPE = 'color' | 'opacity' | 'shadow' | 'transform' | 'all' | 'fileButton'
export type NOTIFICATION_POSITION = "top-end" | "top-center" | "top-start" | "bottom-end" | "bottom-center" | "bottom-start"

type RoundClassesType = {
  [type in ROUNDED_ITEM_TYPES]: {
    [side in ROUNDED_SIDES]: {
      [size in Exclude<ROUNDED, "none" | undefined>]: string;
    }
  }
}

import type { ANIMATE_SPEED, ROUNDED, SHADOW, ROUNDED_SIDES, ROUNDED_ITEM_TYPES, NOTIFY_CONFIG, NOTIFICATION_TYPE } from "$lib/types"
import { twMerge } from "tailwind-merge"

const roundClasses: RoundClassesType = {
  default: {
    all: {
      sm: " rounded",
      md: " rounded-md",
      lg: " rounded-lg",
      xl: " rounded-xl",
      full: " rounded-full",
    },
    top: {
      sm: " rounded-t",
      md: " rounded-t-md",
      lg: " rounded-t-lg",
      xl: " rounded-t-xl",
      full: " rounded-t-full",
    },
    end: {
      sm: " rounded-e",
      md: " rounded-e-md",
      lg: " rounded-e-lg",
      xl: " rounded-e-xl",
      full: " rounded-e-full",
    },
    bottom: {
      sm: " rounded-b",
      md: " rounded-b-md",
      lg: " rounded-b-lg",
      xl: " rounded-b-xl",
      full: " rounded-b-full",
    },
    start: {
      sm: " rounded-s",
      md: " rounded-s-md",
      lg: " rounded-s-lg",
      xl: " rounded-s-xl",
      full: " rounded-s-full",
    },
    topStart: {
      sm: " rounded-ss",
      md: " rounded-ss-md",
      lg: " rounded-ss-lg",
      xl: " rounded-ss-xl",
      full: " rounded-ss-full",
    },
    topEnd: {
      sm: " rounded-se",
      md: " rounded-se-md",
      lg: " rounded-se-lg",
      xl: " rounded-se-xl",
      full: " rounded-se-full",
    },
    bottomStart: {
      sm: " rounded-es",
      md: " rounded-es-md",
      lg: " rounded-es-lg",
      xl: " rounded-es-xl",
      full: " rounded-es-full",
    },
    bottomEnd: {
      sm: " rounded-ee",
      md: " rounded-ee-md",
      lg: " rounded-ee-lg",
      xl: " rounded-ee-xl",
      full: " rounded-ee-full",
    },
  },
  fileButton: {
    all: {
      sm: " file:rounded",
      md: " file:rounded-md",
      lg: " file:rounded-lg",
      xl: " file:rounded-xl",
      full: " file:rounded-full",
    },
    top: {
      sm: " file:rounded-t",
      md: " file:rounded-t-md",
      lg: " file:rounded-t-lg",
      xl: " file:rounded-t-xl",
      full: " file:rounded-t-full",
    },
    end: {
      sm: " file:rounded-e",
      md: " file:rounded-e-md",
      lg: " file:rounded-e-lg",
      xl: " file:rounded-e-xl",
      full: " file:rounded-e-full",
    },
    bottom: {
      sm: " file:rounded-b",
      md: " file:rounded-b-md",
      lg: " file:rounded-b-lg",
      xl: " file:rounded-b-xl",
      full: " file:rounded-b-full",
    },
    start: {
      sm: " file:rounded-s",
      md: " file:rounded-s-md",
      lg: " file:rounded-s-lg",
      xl: " file:rounded-s-xl",
      full: " file:rounded-s-full",
    },
    topStart: {
      sm: " file:rounded-ss",
      md: " file:rounded-ss-md",
      lg: " file:rounded-ss-lg",
      xl: " file:rounded-ss-xl",
      full: " file:rounded-ss-full",
    },
    topEnd: {
      sm: " file:rounded-se",
      md: " file:rounded-se-md",
      lg: " file:rounded-se-lg",
      xl: " file:rounded-se-xl",
      full: " file:rounded-se-full",
    },
    bottomStart: {
      sm: " file:rounded-es",
      md: " file:rounded-es-md",
      lg: " file:rounded-es-lg",
      xl: " file:rounded-es-xl",
      full: " file:rounded-es-full",
    },
    bottomEnd: {
      sm: " file:rounded-ee",
      md: " file:rounded-ee-md",
      lg: " file:rounded-ee-lg",
      xl: " file:rounded-ee-xl",
      full: " file:rounded-ee-full",
    },
  },
  first: {
    all: {
      sm: " first:rounded",
      md: " first:rounded-md",
      lg: " first:rounded-lg",
      xl: " first:rounded-xl",
      full: " first:rounded-full",
    },
    top: {
      sm: " first:rounded-t",
      md: " first:rounded-t-md",
      lg: " first:rounded-t-lg",
      xl: " first:rounded-t-xl",
      full: " first:rounded-t-full",
    },
    end: {
      sm: " first:rounded-e",
      md: " first:rounded-e-md",
      lg: " first:rounded-e-lg",
      xl: " first:rounded-e-xl",
      full: " first:rounded-e-full",
    },
    bottom: {
      sm: " first:rounded-b",
      md: " first:rounded-b-md",
      lg: " first:rounded-b-lg",
      xl: " first:rounded-b-xl",
      full: " first:rounded-b-full",
    },
    start: {
      sm: " first:rounded-s",
      md: " first:rounded-s-md",
      lg: " first:rounded-s-lg",
      xl: " first:rounded-s-xl",
      full: " first:rounded-s-full",
    },
    topStart: {
      sm: " first:rounded-ss",
      md: " first:rounded-ss-md",
      lg: " first:rounded-ss-lg",
      xl: " first:rounded-ss-xl",
      full: " first:rounded-ss-full",
    },
    topEnd: {
      sm: " first:rounded-se",
      md: " first:rounded-se-md",
      lg: " first:rounded-se-lg",
      xl: " first:rounded-se-xl",
      full: " first:rounded-se-full",
    },
    bottomStart: {
      sm: " first:rounded-es",
      md: " first:rounded-es-md",
      lg: " first:rounded-es-lg",
      xl: " first:rounded-es-xl",
      full: " first:rounded-es-full",
    },
    bottomEnd: {
      sm: " first:rounded-ee",
      md: " first:rounded-ee-md",
      lg: " first:rounded-ee-lg",
      xl: " first:rounded-ee-xl",
      full: " first:rounded-ee-full",
    }
  },
  last: {
    all: {
      sm: " last:rounded",
      md: " last:rounded-md",
      lg: " last:rounded-lg",
      xl: " last:rounded-xl",
      full: " last:rounded-full",
    },
    top: {
      sm: " last:rounded-t",
      md: " last:rounded-t-md",
      lg: " last:rounded-t-lg",
      xl: " last:rounded-t-xl",
      full: " last:rounded-t-full",
    },
    end: {
      sm: " last:rounded-e",
      md: " last:rounded-e-md",
      lg: " last:rounded-e-lg",
      xl: " last:rounded-e-xl",
      full: " last:rounded-e-full",
    },
    bottom: {
      sm: " last:rounded-b",
      md: " last:rounded-b-md",
      lg: " last:rounded-b-lg",
      xl: " last:rounded-b-xl",
      full: " last:rounded-b-full",
    },
    start: {
      sm: " last:rounded-s",
      md: " last:rounded-s-md",
      lg: " last:rounded-s-lg",
      xl: " last:rounded-s-xl",
      full: " last:rounded-s-full",
    },
    topStart: {
      sm: " last:rounded-ss",
      md: " last:rounded-ss-md",
      lg: " last:rounded-ss-lg",
      xl: " last:rounded-ss-xl",
      full: " last:rounded-ss-full",
    },
    topEnd: {
      sm: " last:rounded-se",
      md: " last:rounded-se-md",
      lg: " last:rounded-se-lg",
      xl: " last:rounded-se-xl",
      full: " last:rounded-se-full",
    },
    bottomStart: {
      sm: " last:rounded-es",
      md: " last:rounded-es-md",
      lg: " last:rounded-es-lg",
      xl: " last:rounded-es-xl",
      full: " last:rounded-es-full",
    },
    bottomEnd: {
      sm: " last:rounded-ee",
      md: " last:rounded-ee-md",
      lg: " last:rounded-ee-lg",
      xl: " last:rounded-ee-xl",
      full: " last:rounded-ee-full",
    },
  },
  after: {
    all: {
      sm: " after:rounded",
      md: " after:rounded-md",
      lg: " after:rounded-lg",
      xl: " after:rounded-xl",
      full: " after:rounded-full",
    },
    top: {
      sm: " after:rounded-t",
      md: " after:rounded-t-md",
      lg: " after:rounded-t-lg",
      xl: " after:rounded-t-xl",
      full: " after:rounded-t-full",
    },
    end: {
      sm: " after:rounded-e",
      md: " after:rounded-e-md",
      lg: " after:rounded-e-lg",
      xl: " after:rounded-e-xl",
      full: " after:rounded-e-full",
    },
    bottom: {
      sm: " after:rounded-b",
      md: " after:rounded-b-md",
      lg: " after:rounded-b-lg",
      xl: " after:rounded-b-xl",
      full: " after:rounded-b-full",
    },
    start: {
      sm: " after:rounded-s",
      md: " after:rounded-s-md",
      lg: " after:rounded-s-lg",
      xl: " after:rounded-s-xl",
      full: " after:rounded-s-full",
    },
    topStart: {
      sm: " after:rounded-ss",
      md: " after:rounded-ss-md",
      lg: " after:rounded-ss-lg",
      xl: " after:rounded-ss-xl",
      full: " after:rounded-ss-full",
    },
    topEnd: {
      sm: " after:rounded-se",
      md: " after:rounded-se-md",
      lg: " after:rounded-se-lg",
      xl: " after:rounded-se-xl",
      full: " after:rounded-se-full",
    },
    bottomStart: {
      sm: " after:rounded-es",
      md: " after:rounded-es-md",
      lg: " after:rounded-es-lg",
      xl: " after:rounded-es-xl",
      full: " after:rounded-es-full",
    },
    bottomEnd: {
      sm: " after:rounded-ee",
      md: " after:rounded-ee-md",
      lg: " after:rounded-ee-lg",
      xl: " after:rounded-ee-xl",
      full: " after:rounded-ee-full",
    },
  },
  before: {
    all: {
      sm: " before:rounded",
      md: " before:rounded-md",
      lg: " before:rounded-lg",
      xl: " before:rounded-xl",
      full: " before:rounded-full",
    },
    top: {
      sm: " before:rounded-t",
      md: " before:rounded-t-md",
      lg: " before:rounded-t-lg",
      xl: " before:rounded-t-xl",
      full: " before:rounded-t-full",
    },
    end: {
      sm: " before:rounded-e",
      md: " before:rounded-e-md",
      lg: " before:rounded-e-lg",
      xl: " before:rounded-e-xl",
      full: " before:rounded-e-full",
    },
    bottom: {
      sm: " before:rounded-b",
      md: " before:rounded-b-md",
      lg: " before:rounded-b-lg",
      xl: " before:rounded-b-xl",
      full: " before:rounded-b-full",
    },
    start: {
      sm: " before:rounded-s",
      md: " before:rounded-s-md",
      lg: " before:rounded-s-lg",
      xl: " before:rounded-s-xl",
      full: " before:rounded-s-full",
    },
    topStart: {
      sm: " before:rounded-ss",
      md: " before:rounded-ss-md",
      lg: " before:rounded-ss-lg",
      xl: " before:rounded-ss-xl",
      full: " before:rounded-ss-full",
    },
    topEnd: {
      sm: " before:rounded-se",
      md: " before:rounded-se-md",
      lg: " before:rounded-se-lg",
      xl: " before:rounded-se-xl",
      full: " before:rounded-se-full",
    },
    bottomStart: {
      sm: " before:rounded-es",
      md: " before:rounded-es-md",
      lg: " before:rounded-es-lg",
      xl: " before:rounded-es-xl",
      full: " before:rounded-es-full",
    },
    bottomEnd: {
      sm: " before:rounded-ee",
      md: " before:rounded-ee-md",
      lg: " before:rounded-ee-lg",
      xl: " before:rounded-ee-xl",
      full: " before:rounded-ee-full",
    },
  }
}

const animationSpeed: { [t in 'default' | 'after' | 'before']: { [speed in Exclude<ANIMATE_SPEED, "none">]: string }} = {
  default: {
    slower: "duration-700",
    slow: "duration-500",
    normal: "duration-300",
    fast: "duration-200",
    faster: "duration-100",
  },
  after: {
    slower: "after:duration-700",
    slow: "after:duration-500",
    normal: "after:duration-300",
    fast: "after:duration-200",
    faster: "after:duration-100",
  },
  before: {
    slower: "before:duration-700",
    slow: "before:duration-500",
    normal: "before:duration-300",
    fast: "before:duration-200",
    faster: "before:duration-100",
  }
}

const animationType: { [t in 'default' | 'after' | 'before']: Record<string, string> } = {
  default: {
    color: "transition-colors",
    opacity: "transition-opacity",
    shadow: "transition-shadow",
    transform: "transition-transform",
    all: "transition-all"
  },
  after: {
    color: "after:transition-colors",
    opacity: "after:transition-opacity",
    shadow: "after:transition-shadow",
    transform: "after:transition-transform",
    all: "after:transition-all"
  },
  before: {
    color: "before:transition-colors",
    opacity: "before:transition-opacity",
    shadow: "before:transition-shadow",
    transform: "before:transition-transform",
    all: "before:transition-all"
  }
}

const fileButtonAnimation: { [speed in Exclude<ANIMATE_SPEED, "none">]: string } = {
  slower: "file:duration-700 transition-all",
  slow: "file:duration-500 transition-all",
  normal: "file:duration-300 transition-all",
  fast: "file:duration-150 transition-all",
  faster: "file:duration-100 transition-all",
}

const shadowClasses: { [size in Exclude<SHADOW, "none">]: string } = {
  xs: " shadow-sm",
  sm: " shadow",
  md: " shadow-md",
  lg: " shadow-lg",
  xl: " shadow-xl",
  "2xl": " shadow-2xl",
  inner: " shadow-inner"
}

export const messageTheme = {
  default: {
    brand: "bg-brand-primary-500 text-on-brand-primary-500",
    error: "bg-error-500 text-error-50 dark:bg-error-600",
    info: "bg-info-600 text-info-50 dark:bg-info-700",
    success: "bg-success-600 text-success-50 dark:bg-success-700",
    warning: "bg-warning-300 dark:bg-warning-600 text-warning-900 dark:text-warning-50",
  },
  light: {
    brand: "bg-brand-primary-100 text-brand-primary-800",
    error: "bg-error-100 text-error-900 dark:bg-error-800 dark:text-error-200",
    info: "bg-info-100 text-info-900 dark:bg-info-900 dark:text-info-200",
    success: "bg-success-100 text-success-900 dark:bg-success-900 dark:text-success-200",
    warning: "bg-warning-100 text-warning-900 dark:bg-warning-900 dark:text-warning-200",
  },
  gradient: {
    brand: "bg-gradient-to-r from-brand-primary-300 via-brand-primary-400 to-brand-primary-500 text-on-brand-primary-500",
    error: "bg-gradient-to-r from-error-400 via-error-500 to-error-600",
    info: "bg-gradient-to-r from-info-400 via-info-500 to-info-600",
    success: "bg-gradient-to-r from-success-400 via-success-500 to-success-600",
    warning: "bg-gradient-to-r from-warning-300 via-warning-400 to-warning-600",
  }
}

export const messageBarTheme = {
  default: {
    brand: "border-brand-primary-200 dark:border-brand-primary-800",
    error: "border-error-200 dark:border-error-800",
    info: "border-info-200 dark:border-info-800",
    success: "border-success-200 dark:border-success-800",
    warning: "border-warning-500 dark:border-warning-700",
  },
  light: {
    brand: "border-brand-primary-300 dark:border-brand-primary-700",
    error: "border-error-300 dark:border-error-700",
    info: "border-info-300 dark:border-info-800",
    success: "border-success-300 dark:border-success-800",
    warning: "border-warning-500 dark:border-warning-800",
  },
  gradient: {
    brand: "border-brand-primary-300 dark:border-brand-primary-700",
    error: "border-error-300 dark:border-error-700",
    info: "border-info-300 dark:border-info-800",
    success: "border-success-300 dark:border-success-800",
    warning: "border-warning-500 dark:border-warning-800",
  },
}

/**
 * Checks if a key exists in an object and returns a boolean indicating its presence.
 * 
 * @param obj - The object to check.
 * @param key - The key to verify.
 * @returns `true` if the key exists in the object, otherwise `false`.
 * 
 * @example
 * const data = { name: "Alice", age: 30 };
 * isKeyExist(data, "name"); // Returns true
 * isKeyExist(data, "height"); // Returns false
 */
export const isKeyExist = (obj: Record<string, unknown>, key: string): boolean => key in obj


/**
 * Generates a random integer within a given range.
 * 
 * @param min - The minimum value (inclusive). Defaults to 10.
 * @param max - The maximum value (inclusive). Defaults to 99.
 * @returns A random integer between `min` and `max`, inclusive.
 * 
 * @example
 * generateRandomNum(1, 100); // Random number between 1 and 100
 * generateRandomNum(); // Random number between 10 and 99
 */
export const generateRandomNum = (min = 10, max = 99): number => Math.floor(Math.random() * (max - min + 1)) + min


/**
 * Generates a unique alphanumeric token with a prefix, timestamp, and random number.
 * 
 * @param prefix - Optional string prefix for the token, defaults to "_id".
 * @returns A unique token string combining the prefix, current timestamp, and randomness.
 * 
 * @example
 * generateToken("user_"); // Example output: "user_lk9vby43j24"
 * generateToken();        // Example output: "_id_k9vmzct08f"
 */
export const generateToken = (prefix: string = "_id"): string => `${prefix}${(Date.now() + 1).toString(36)}${generateRandomNum()}`


/**
 * Generates CSS classes for animations based on the speed and property type.
 *
 * @param animate - Animation speed (e.g., "slow", "fast"), or undefined to disable animation.
 * @param type - Animation property type (e.g., "all", "color"), defaults to "all".
 * @returns A string with the computed CSS animation classes.
 */
export const animationClass = (animate: ANIMATE_SPEED | undefined, type: ANIMATION_PROPERTY_TYPE = "all", elType: 'default' | 'after' | 'before' = "default"): string => {
  if (!animate || animate === "none") return " "
  return  ` theui-animate ease-in-out ${type === "fileButton" ?
    (fileButtonAnimation?.[animate] || "") : `${animationSpeed[elType]?.[animate] || ""} ${animationType[elType]?.[type] || ""}`}`
}


/**
 * Generates CSS classes for rounded corners based on size, side, and item type.
 *
 * @param value - Rounded size (e.g., "sm", "lg"), defaults to "md". Use "none" to disable rounding.
 * @param side - Sides to apply the rounding (e.g., "all", "top"), defaults to "all".
 * @param type - Item type (e.g., "default", "fileButton"), defaults to "default".
 * @returns A string with the computed Tailwind CSS rounded classes.
 */
export const roundedClass = (value: ROUNDED = "md", side: ROUNDED_SIDES = "all", type: ROUNDED_ITEM_TYPES = "default"): string =>
  value && value !== "none" ? roundClasses[type]?.[side]?.[value] || " " : " "


/**
 * Generates CSS classes for shadow effects based on the shadow size.
 *
 * @param size - Shadow intensity (e.g., "sm", "lg"), optional. Use "none" or leave undefined to disable shadow.
 * @returns A string with the computed Tailwind CSS shadow classes.
 */
export const shadowClass = (size?: SHADOW): string => size && size !== "none" ? shadowClasses[size] || "" : ""


/**
 * Checks if a given URL belongs to the same origin as the current window location.
 *
 * @param url - The URL to check.
 * @returns `true` if the URL is local, otherwise `false`.
 */
export const isLocalUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url, window.location.origin)
    return parsedUrl.origin === window.location.origin
  } catch {
    return false
  }
}


/**
 * Generates CSS classes for notifications based on configuration, type, and additional properties.
 *
 * @param config - Notification configuration, including theme, rounded corners, and variant.
 * @param type - Notification type (e.g., `error`, `success`). Defaults to `error`.
 * @param props - Additional properties, such as a custom class.
 * @returns A string of merged classes for the notification.
 */
export const notificationClasses = (config: NOTIFY_CONFIG, type: NOTIFICATION_TYPE = "error", props: Record<string, unknown> = {}): string => {
  const theme = config?.theme || "default"
  const baseClass = `theui-notification px-4 py-3 shadow-2xl shadow-black/50 cursor-pointer ${messageTheme[theme][type]}`

  const variantClasses: Record<string, string> = {
    card: roundedClass(config?.rounded || "md"),
    barTop: `${roundedClass(config?.rounded || "md", "bottom")} ${messageBarTheme[theme][type]} border-t-4`,
    barBottom: `${roundedClass(config?.rounded || "md", "top")} ${messageBarTheme[theme][type]} border-b-4`,
    barStart: `${roundedClass(config?.rounded || "md")} ${messageBarTheme[theme][type]} border-s-4`,
  }

  return twMerge(baseClass, theme !== "gradient" ? variantClasses[config?.variant || "card"] : "", props.class as string)
}


/**
 * Generates CSS classes for a backdrop element.
 *
 * @param backdrop - A string for custom classes or a boolean for default styling.
 * @returns A string of merged classes for the backdrop.
 */
export const backdropClasses = (backdrop: string | boolean): string => {
  const defaultClasses = "backdrop fixed inset-0 bg-black z-[-1] opacity-50 dark:opacity-75"
  const customClasses = typeof backdrop === "string" ? backdrop : ""
  return twMerge(defaultClasses, customClasses)
}



// 
// =======================================
//

// export const setInitialStyle = (el: HTMLElement) => {
//   Object.assign(el.style, { visibility: "hidden", display: "block", opacity: 0, top: "-9999px", left: "-9999px" });
// }


// export const resetAndToggle = (
//   el: HTMLElement,
//   component: HTMLElement,
//   finalPosition: POSITION_TYPES,
//   positionClasses: Record<POSITION_TYPES, string>,
//   offset: number,
// ): { finalPosition: POSITION_TYPES; positionalClasses: string } => {
//   const rect: DOMRect = el.getBoundingClientRect();
//   const elemRect: DOMRect = component.getBoundingClientRect();
//   let { top: newTop, left: newLeft } = calculatePosition(finalPosition, rect, elemRect, offset);

//   if (isOverflowing(newTop, newLeft, elemRect)) {
//     const alternatePositions = ["bottom", "top", "right", "left"] as POSITION_TYPES[];
//     for (const pos of alternatePositions) {
//       ({ top: newTop, left: newLeft } = calculatePosition(pos, rect, elemRect, offset));
//       if (!isOverflowing(newTop, newLeft, elemRect)) {
//         finalPosition = pos;
//         break;
//       }
//     }
//   }

//   // Final check: Keep tooltip inside screen bounds
//   ({ top: newTop, left: newLeft } = keepInBounds(newTop, newLeft, elemRect));

//   // Apply position styles
//   setVisibleStyle(component, newTop, newLeft);

//   // Return the final position and positional classes
//   return { finalPosition, positionalClasses: positionClasses[finalPosition] };
// }


// export const removeElement = (element: HTMLElement, component: HTMLElement) => {
//   if (component.parentElement === document.body) {
//     document.body.removeChild(component);
//   }
//   component.classList.add("hidden");
//   Object.assign(component.style, { visibility: "hidden" });
// }


// export const calculatePosition = (pos: POSITION_TYPES, rect: DOMRect, elemRect: DOMRect, offset: number) => {
//   const scrollX = window.scrollX;
//   const scrollY = window.scrollY;

//   switch (pos) {
//     case "top":
//       return {
//         top: rect.top + scrollY - offset - elemRect.height,
//         left: rect.left + scrollX + (rect.width / 2) - (elemRect.width / 2)
//       };
//     case "bottom":
//       return {
//         top: rect.bottom + scrollY + offset,
//         left: rect.left + scrollX + (rect.width / 2) - (elemRect.width / 2)
//       };
//     case "left":
//       return {
//         top: rect.top + scrollY + (rect.height / 2) - (elemRect.height / 2),
//         left: rect.left + scrollX - elemRect.width - offset
//       };
//     case "right":
//       return {
//         top: rect.top + scrollY + (rect.height / 2) - (elemRect.height / 2),
//         left: rect.right + scrollX + offset
//       };
//     default:
//       return { top: rect.bottom + scrollY + offset, left: rect.left + scrollX };
//   }
// }


// const isOverflowing = (top: number, left: number, elemRect: DOMRect) => {
//   return (top < 0 || left < 0 || top + elemRect.height > window.innerHeight || left + elemRect.width > window.innerWidth);
// };

// const keepInBounds = (top: number, left: number, elemRect: DOMRect) => {
//   return {
//     top: Math.max(8, Math.min(window.innerHeight - elemRect.height - 8, top)),
//     left: Math.max(8, Math.min(window.innerWidth - elemRect.width - 8, left)),
//   };
// };

// export const setVisibleStyle = (el: HTMLElement, referenceEl: HTMLElement) => {
//   const rect = referenceEl.getBoundingClientRect();
//   const newTop = rect.top + window.scrollY; // Account for scrolling
//   const newLeft = rect.left + window.scrollX;

//   el.style.visibility = "visible";
//   el.style.opacity = "1";
//   el.style.transform = `translate(${newLeft}px, ${newTop}px)`;
// };
