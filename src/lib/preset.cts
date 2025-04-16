import type { Config } from 'tailwindcss';

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import twShades from 'tw-color-shades';

export default {
  content: [
    "./node_modules/theui-sveltekit/**/*.{html,js,svelte,ts}",
  ],
  darkMode: "selector",
  theme: {
    screens: {
      nano: "360px",
      xs: "480px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        // Brand specific colors
        "brand-primary": twShades('#E93E3A'),
        "on-brand-primary": twShades('#FFFFFF'),
        "brand-secondary": twShades('#E8E838'),
        "on-brand-secondary": twShades('#2E2105'),
        // Background specific colors
        primary: twShades("--ui-bg-primary"),
        secondary: twShades("--ui-bg-secondary"),
        tertiary: twShades("--ui-bg-tertiary"),
        alt: twShades("--ui-bg-alt"),
        // Info and message specific colors
        error: twShades("#E53935"),
        info: twShades("#29B6F6"),
        success: twShades("#00C853"),
        warning: twShades("#FFC107")
      },
      textColor: {
        default: twShades('--ui-text-default'),
        alt: twShades('--ui-text-alt'),
        muted: twShades('--ui-text-muted'),
      },
    },
  },
  variants: {
    extend: {
      fontWeight: ['dark'],
      fill: ['dark'],
    },
  },
  plugins: [
    typography,
    forms,
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--ui-bg-primary': '253 253 255',
          '--ui-bg-secondary': '243 243 245',
          '--ui-bg-tertiary': '233 233 235',
          '--ui-bg-alt': '22 22 29',
          '--ui-text-default': '22 22 29',
          '--ui-text-alt': '252 252 253',
          '--ui-text-muted': '99 99 105',

          '--max-width': '1280px',
        },

        ':root.dark': {
          '--ui-bg-primary': '22 22 29',
          '--ui-bg-secondary': '30 30 38',
          '--ui-bg-tertiary': '38 38 47',
          '--ui-bg-alt': '252 252 253',
          '--ui-text-default': '252 252 253',
          '--ui-text-alt': '22 22 29',
          '--ui-text-muted': '161, 161, 170',
        },
        'body': {
          '@apply bg-primary text-default': {},
        }
      });
    }),
    plugin(({ addVariant }) => {
      addVariant("not-first-child", "&:not(:first-child)");
      addVariant("not-last-child", "&:not(:last-child)");
      addVariant("edge-child", [
        "&:first-child",
        "&:last-child",
      ]);
      addVariant("not-edge-child", [
        "&:not(:first-child)",
        "&:not(:last-child)",
      ]);
    }),
    plugin(({ addComponents }) => {
      addComponents({
        ".sticky,[class$=sticky]": {
          zIndex: "20",
        },
        ".fixed,[class$=fixed]": {
          zIndex: "30",
        },
      });
    }),
  ],
} satisfies Config;