<script lang="ts">
  import { onMount, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"

  let {systemDefault = true, children, ...props} : {systemDefault?: boolean, children?: Snippet, [key: string]: unknown} = $props()
  let toggleTheme: () => void = () => {}

  let isDarkModeActive: boolean = $state(false)

  onMount((): void => {
    if (!localStorage.theme) {
      localStorage.setItem("theme", systemDefault && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    }
    if(localStorage.theme === "dark"){
      isDarkModeActive = true
      document.documentElement.classList.add("dark")
    }else{
      isDarkModeActive = false
    }
    toggleTheme = () => {
      const newTheme = localStorage.theme === "light" ? "dark" : "light"
      isDarkModeActive = !isDarkModeActive
      localStorage.setItem("theme", newTheme)
      document.documentElement.classList.toggle("dark", newTheme === "dark")
    }
  })
</script>

<button aria-label="Toggle light or dark mode" {...props} class={"theui-theme-toggler " + twMerge("bg-transparent p-0.5 cursor-pointer", props?.class as string)} onclick={()=>toggleTheme()} aria-pressed={isDarkModeActive ? "true" : "false"}>
  {#if children}
    {@render children()}
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-4 h-4">
      <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
    </svg>
  {/if}
</button>