import type { Writable } from "svelte/store"

// Custom types
export type ANIMATE_SPEED =
  | "none"
  | "slower"
  | "slow"
  | "normal"
  | "fast"
  | "faster";

export type ROUNDED = "sm" | "md" | "lg" | "xl" | "full" | "none" | undefined;

export type SHADOW =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "inner"
  | "none";
export type PRELOAD = "" | "off" | "tap" | "hover";
export type TABLE_ROW = string[] | Record<string, unknown>[];
export type BUTTON_SIZE = "xs" | "sm" | "md" | "lg" | "xl" | "auto";
export type INPUT_TYPE = 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'reset' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | 'search' | 'textarea';
export type INPUT_SIZE = "sm" | "md" | "lg" | "xl";
// export type INPUT_VARIANT = "bordered" | "filled" | "flat";
export type INPUT_VARIANT = "bordered" | "flat";
export type BREADCRUMB_DATA = { text: string; url?: string };
export type DROPDOWN_ITEM = {
  active?: boolean;
  url?: string;
  text?: string;
  type?: "button" | "divider" | "header" | "link"
};
export type DROPDOWN_ITEM_CONFIG = {
  activeClass?: string;
  linkClass?: string;
  dividerClass?: string;
  headerClass?: string;
};

export type SITE = {
  siteName: string;
  slogan?: string;
  description: string;
  keywords?: string;
  logoPath?: string;
  imgPath?: string;
  siteSchema?: string;
  businessSchema?: string;
  lang?: string;
  fbAppID?: string;
  pageType?: string;
  twitterCardType?: string;
  twitterID?: string;
  twitterCreatorID?: string;
  video?: string;
  gtmCode?: string;
};

export type CORE = {
  isRounded: boolean;
  toggleTheme: boolean | "system";
  animate: ANIMATE_SPEED;
  reset: boolean;
};

export type INPUT_CONFIG = {
  animate ?: ANIMATE_SPEED;
  labelClasses ?: string | undefined;
  floatingLabel ?: boolean,
  rounded ?: ROUNDED;
  size ?: INPUT_SIZE;
  reset ?: boolean;
  variant ?: INPUT_VARIANT;
};

export type SELECT_DATA = {disabled?: boolean, selected?: boolean, text: string, value?: string|number} | string;

export type Tools = "strike" | "superscript" | "subscript" | "listItem" | "blockquote" | "code" | "codeblock" | "link" | "horizontalLine" | "youtube" | "highlighter" | "color" | "redoUndo";

export type NOTIFICATION_TYPE = "error" | "info" | "success" | "warning";

export type RESPONSIVE_NAV_ON = { sm: string; md: string; lg: string; xl: string; }
export type MOBILE_NAV_ON = keyof RESPONSIVE_NAV_ON

export type NOTIFY_CONFIG = {
  removeAfter?: number;
  removeOnClick?: boolean;
  rounded?: ROUNDED;
  theme ?: "default" | "light"
  variant?: "card" | "borderTop" | "borderBottom" | "borderStart";
};

export type TABLE_CONFIG = {
  animate: ANIMATE_SPEED;
  border: "x" | "y" | "both" | "none";
  borderColor: string;
  hover: boolean | string;
  space: "compact" | "default" | "comfortable" | string;
  stripe: boolean | string;
  trClass: string;
};

export type TAB_CONFIG = {
  activeTabClasses?: string;
  animate?: ANIMATE_SPEED;
  tabClasses?: string;
  tabPanelClasses?: string;
  borderClasses ?: boolean | string;
  variant: 'tabs' | 'pills';
  TABS: { tabs: string[], panels: string[], selectedTab: string | null, selectedPanel: string | null }
};

export type TABS_CONTEXT = {
  registerTab: (param: HTMLElement) => void;
  registerPanel: (param: HTMLElement) => void;
  selectTab: (param: HTMLElement) => void;
  selectedTab: Writable<{ value: HTMLElement | null }>;
  selectedPanel: Writable<{ value: HTMLElement | null }>;
  config: TAB_CONFIG;
}

export type ROUNDED_ITEM_TYPES = "default" | "fileButton" | "first" | "last";
// Private types
export type ROUNDED_SIDES = "top" | "end" | "bottom" | "start" | "topStart" | "topEnd" | "bottomStart" | "bottomEnd" | "all";