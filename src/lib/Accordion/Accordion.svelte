<script lang="ts">
  import { setContext, type Snippet } from "svelte"

  interface Props {children: Snippet, size?: "compact" | "default" | "large", standalone?: boolean}
  let {children, size = "default", standalone = true} : Props = $props()

  setContext("ACCORDION", {group: true, size, standalone})
</script>

<div class="theui-accordion-group flex flex-col" role="group">
  {@render children()}
</div>