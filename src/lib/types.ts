import type { ClassNameValue } from "tailwind-merge"
// Custom types
export type ANIMATE_SPEED =
  | "none"
  | "slower"
  | "slow"
  | "normal"
  | "fast"
  | "faster";

export type ROUNDED = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none" | undefined;

export type SHADOW =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "inner"
  | "none";

export type ACCORDION_SIZE = "compact" | "default" | "large"
export interface ACCORDION_CONTEXT {
  group: boolean
  size: ACCORDION_SIZE
  standalone: boolean
  animationSpeed: ANIMATE_SPEED
  flush: boolean
  rounded: ROUNDED
  containerClasses: string
  openContainerClasses: string
  titleClasses: string
  openTitleClasses: string
  contentClasses: string
  id: string
}

export interface BTN_QAB_CTX {
  size: 'sm' | 'md' | 'lg' | 'xl',
  rounded: ROUNDED,
  iconClasses?: string,
  color: 'brand' | 'error' | 'info' | 'success' | 'warning',
  theme: 'default' | 'soft' | 'gradient',
  gradientColor: 'brand' | 'error' | 'info' | 'success' | 'warning'
}

export type PRELOAD = false | "off" | "tap" | "hover";
export type TABLE_DATA = string[] | Record<string, unknown>[];
export type BUTTON_SIZE = "xs" | "sm" | "md" | "lg" | "xl" | "auto";
export type INPUT_TYPE = 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week' | 'search' | 'textarea';
export type INPUT_SIZE = "sm" | "md" | "lg" | "xl";
export type INPUT_VARIANT = "bordered" | "flat"; //  | "filled"
export type BREADCRUMB_DATA = { text: string; url?: string };
export type DROPDOWN_CTX = {
  activeItemClasses: string;
  itemClasses: string;
  dividerClass: string;
  headerClass: string;
};

export interface NAV_CTX {
  config: {
    height: NAV_HEIGHT_TYPES | string
    navBreakpoint: MOBILE_NAV_ON | false
    animationSpeed: ANIMATE_SPEED
    rounded: ROUNDED
    dropdownTriggerEvent: 'hover' | 'click'
    responsive?: boolean
    linkClasses: string
    activeLinkClasses: string
    dropdownLinkClasses?: string
    navCollapseClasses?: string
    navInnerClasses?: string
    isDropdownLink?: boolean
  }
  id: string
}

export type CARD_IMAGE_TYPE = { class?: string, src ?: string, alt ?: string, [key: string]: unknown }

export type LIST_GROUP_CTX = {
  animationSpeed?: ANIMATE_SPEED;
  itemClasses?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Library wide defaults, set once with `setTheuiDefaults()`.
 * A prop on a component, or a `Form`/`Fieldset` around it, still wins over these.
 */
export type CORE = {
  /**
   * Set to `false` to square off every component, whatever its `rounded` prop says.
   * Leave it out, or set it to `true`, and every `rounded` prop works as usual.
   */
  rounded?: boolean;
  /** Transition speed for every component that has an `animationSpeed` prop. */
  animationSpeed?: ANIMATE_SPEED;
  /** Drop the default look of every form component and keep only your own classes. */
  reset?: boolean;
  /** Drop shadow for `Button`, `Card` and `Popover`. */
  shadow?: SHADOW;
};

export type INPUT_CONFIG = {
  animationSpeed ?: ANIMATE_SPEED;
  labelClasses ?: string | undefined;
  floatingLabel ?: boolean,
  rounded ?: ROUNDED;
  size ?: INPUT_SIZE;
  reset ?: boolean;
  variant ?: INPUT_VARIANT;
  inputGrow?: boolean;
};

export type SELECT_DATA = {disabled?: boolean, text: string, value?: unknown};

export type NOTIFICATION_TYPE = "error" | "info" | "success" | "warning"

export type NOTIFICATION_POSITION = "top-end" | "top-center" | "top-start" | "bottom-end" | "bottom-center" | "bottom-start"

export type RESPONSIVE_NAV_ON = { sm: string; md: string; lg: string; xl: string; }

export type MOBILE_NAV_ON = keyof RESPONSIVE_NAV_ON

export type NAV_HEIGHT_TYPES = 'sm' | 'md' | 'lg' | 'xl'

export type NAV_SCROLL_BEHAVIOR = 'default' | 'fixed' | 'shrinkOnScrollDown' | 'hideOnScrollDown' | 'shrinkAndHide'

export type NOTIFY_CONFIG = {
  removeAfter?: number|false;
  removeOnClick?: boolean;
  rounded?: ROUNDED;
  theme?: "default" | "soft" | "gradient";
  variant?: "card" | "borderTop" | "borderBottom" | "borderStart";
};

export type NOTIFICATION_DATA_TYPE = {
  msg: string,
  type: NOTIFICATION_TYPE,
  CONFIG: NOTIFY_CONFIG & { id: string }
  removing?: boolean
};

export interface TABLE_CONTEXT {
  animationSpeed: ANIMATE_SPEED
  border: 'x' | 'y' | 'both' | 'none'
  borderColor: string
  hover: true | ClassNameValue
  space: 'compact' | 'default' | 'comfortable'
  stripe: "even" | "odd" | ClassNameValue
  trHeadClasses: string
  trClasses: string
  thClasses: string
  tdClasses: string
}

export type TABS_CONTEXT = {
  variant: 'tabs' | 'pills';
  animationSpeed?: ANIMATE_SPEED;
  border ?: boolean | string;
  tabClasses?: string;
  tabActiveClasses?: string;
  tabPanelClasses?: string;
  TABS: {
    tabIds: string[];
    panelIds: string[];
    selectedTabId: string | null;
    selectedPanelId: string | null;
    selectedValue: string | null;
    tabIdByValue: Record<string, string>;
    panelIdByValue: Record<string, string>;
  }
};

export type SLIDER_EFFECT = "slide" | "fade" | "zoom" | "flip" | "cube"

export type SLIDER_DIRECTION = "horizontal" | "vertical"

export type SLIDER_BREAKPOINT = "base" | "sm" | "md" | "lg" | "xl" | "2xl"

// A single value, or a value per screen size like { base: 1, md: 2, lg: 3 }
export type SLIDER_RESPONSIVE<T> = T | Partial<Record<SLIDER_BREAKPOINT, T>>

export type SLIDE_INFO = {
  readonly thumbnail?: string;
  readonly alt?: string;
}

export type SLIDE_STATE = {
  index: number;
  total: number;
  // Painted on screen, even partly, like a peeking neighbor
  visible: boolean;
  // One of the slides the slider is showing; the others are hidden from keyboard and screen readers
  current: boolean;
  active: boolean;
  style: string;
  // How far the slide is from its resting place, from -1 to 1. Parallax layers move by it.
  parallax: number;
}

export type SLIDER_CTX = {
  add: (id: string, info: SLIDE_INFO) => void;
  remove: (id: string) => void;
  slide: (id: string) => SLIDE_STATE;
  readonly slideClasses: string;
  readonly kenBurns: boolean;
  readonly kenBurnsDuration: number;
  readonly parallax: number;
  readonly vertical: boolean;
  readonly rtl: boolean;
}

export type RANGE_TICK = number | { value: number; label?: string }

export type COMBOBOX_ITEM = string | number | {
  value?: unknown;
  text?: string;
  disabled?: boolean;
  // Options with the same group name are shown together under its heading
  group?: string;
}

// A COMBOBOX_ITEM after the component has filled in the missing parts
export type COMBOBOX_OPTION = {
  value: unknown;
  text: string;
  disabled: boolean;
  group?: string;
}

export type OTP_TYPE = "text" | "number" | "password"

export type DROPZONE_REJECTION = {
  file: File;
  // Why the file was not accepted
  reason: "type" | "size" | "count";
}

export type WIZARD_STEP_INFO = {
  readonly title?: string;
  readonly description?: string;
  readonly optional?: boolean;
  readonly validate?: () => boolean | Promise<boolean>;
}

export type WIZARD_STEP_STATE = {
  index: number;
  total: number;
  active: boolean;
  // Every step before the active one counts as complete
  complete: boolean;
}

export type WIZARD_CTX = {
  add: (id: string, info: WIZARD_STEP_INFO) => void;
  remove: (id: string) => void;
  step: (id: string) => WIZARD_STEP_STATE;
  readonly stepClasses: string;
}

export type AVATAR_SIZE = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export type AVATAR_STATUS = "online" | "offline" | "busy" | "away"

export type AVATAR_GROUP_CTX = {
  add: (id: string) => void;
  remove: (id: string) => void;
  // False for avatars past `max`; they are counted in the "+N" avatar instead
  shown: (id: string) => boolean;
  readonly size: AVATAR_SIZE;
  readonly rounded: ROUNDED;
}

export type SPINNER_VARIANT = "ring" | "dots" | "ping"

export type SPINNER_SIZE = "xs" | "sm" | "md" | "lg" | "xl"

export type SKELETON_VARIANT = "rect" | "circle" | "text"

export type SKELETON_ANIMATION = "pulse" | "wave" | "none"

export type DIVIDER_ORIENTATION = "horizontal" | "vertical"

export type DIVIDER_ALIGN = "start" | "center" | "end"

export type DIVIDER_VARIANT = "solid" | "dashed" | "dotted"

export type RATING_SIZE = "sm" | "md" | "lg" | "xl"

// export type TABS_CONTEXT = {
//   registerTab: (param: HTMLElement) => void;
//   registerPanel: (param: HTMLElement) => void;
//   selectTab: (param: HTMLElement) => void;
//   selectedTab: Writable<{ value: HTMLElement | null }>;
//   selectedPanel: Writable<{ value: HTMLElement | null }>;
//   config: TAB_CONFIG;
// }

export type ROUNDED_ITEM_TYPES = "default" | "fileButton" | "first" | "last" | "after" | "before" | "edge";
// Private types
export type ROUNDED_SIDES = "top" | "end" | "bottom" | "start" | "topStart" | "topEnd" | "bottomStart" | "bottomEnd" | "all";