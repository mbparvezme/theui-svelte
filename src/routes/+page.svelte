<script lang="ts">
	import { onMount, type Snippet } from "svelte";
  import twShades from "tw-color-shades";
  // console.log("Error", twShades("#E53935"))
  // console.log("info", twShades("#29B6F6"))
  // console.log("success", twShades("#00C853"))
  // console.log("warning", twShades("#FFC107"))

  let {systemDefault = true, children, ...props} : {systemDefault?: boolean, children?: Snippet, [key: string]: unknown} = $props()
  let toggleTheme: () => void = () => {}
  onMount(() => {
    if (!localStorage.theme) {
      localStorage.setItem("theme", systemDefault && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    if(localStorage.theme === "dark"){
      document.documentElement.classList.add("dark")
    }
    toggleTheme = () => {
      const newTheme = localStorage.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  })

</script>

<div class="bg-secondary">
  <h1 class=" bg-info-500 p-8">Welcome to your library project</h1>
  <h1 class=" bg-error-500 p-8">Welcome to your library project</h1>
  <h1 class=" bg-success-500 p-8">Welcome to your library project</h1>
  <h1 class=" bg-warning-500 p-8">Welcome to your library project</h1>
</div>
<button onclick={() => toggleTheme()}>Theme</button>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
