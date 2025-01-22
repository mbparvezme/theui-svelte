<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import { generateToken } from "$lib/function"

  interface Props {children: Snippet, size?: "compact" | "default" | "large", standalone?: boolean, id?: string}
  let {children, size = "default", standalone = true, id = generateToken()} : Props = $props()

  setContext("ACCORDION", {group: true, id, size, standalone})
</script>

<div {id} class="theui-accordion-group flex flex-col" role="group">
  {@render children()}
</div>