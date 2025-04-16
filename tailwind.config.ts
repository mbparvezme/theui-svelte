import type { Config } from 'tailwindcss'
import preset from "./src/lib/preset.cjs"

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  presets: [preset],
  theme: {
    extend: {}
  }
} satisfies Config
