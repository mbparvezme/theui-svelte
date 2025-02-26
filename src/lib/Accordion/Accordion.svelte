<script lang="ts">
  import { generateToken } from "$lib/function";
  import { setContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge";

  interface Props {children: Snippet, size?: "compact" | "default" | "large", standalone?: boolean, [key: string] : unknown}
  let {children, size = "default", standalone = true, ...props} : Props = $props()

  let id: string = generateToken()

  setContext("ACCORDION", {group: true, size, standalone, id, flush: props?.flush})
</script>

<div {id} class={twMerge("theui-accordion-group flex flex-col", props?.class as string)} role="group">
  {@render children()}
</div>