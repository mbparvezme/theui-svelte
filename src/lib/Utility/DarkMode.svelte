<script lang="ts">
  import { onMount, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"

  type Theme = "light" | "dark"
  const STORAGE_KEY = "theui-theme"

  let {
    systemDefault = true,
    children,
    ...props
  }: { systemDefault?: boolean; children?: Snippet; [key: string]: unknown } = $props()

  let isDarkModeActive = $state(false)
  let mounted = $state(false)

  function getSystemTheme(): Theme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  function getStoredTheme(): Theme | null {
    return localStorage.getItem(STORAGE_KEY) as Theme | null
  }

  function applyTheme(theme: Theme) {
    isDarkModeActive = theme === "dark"
    document.documentElement.classList.toggle("dark", theme === "dark")
  }

  function resolveTheme(): Theme {
    const stored = getStoredTheme()
    if (stored) return stored
    return systemDefault ? getSystemTheme() : "light"
  }

  function toggleTheme() {
    const next: Theme = getStoredTheme() === "dark" ? "light" : "dark"
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }

  onMount(() => {
    applyTheme(resolveTheme())
    mounted = true
  })

  $effect(() => {
    if (mounted && !getStoredTheme()) {
      applyTheme(systemDefault ? getSystemTheme() : "light")
    }
  })
</script>

<button
  aria-label="Toggle light or dark mode"
  {...props}
  class={twMerge("theui-theme-toggler bg-transparent p-0.5 cursor-pointer", props?.class as string)}
  onclick={toggleTheme}
  aria-pressed={isDarkModeActive ? "true" : "false"}
>
  {#if children}
    {@render children()}
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-4 h-4">
      <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
    </svg>
  {/if}
</button>