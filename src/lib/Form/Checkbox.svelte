<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
  import { generateToken } from "$lib/function"
  import { inputContainerClass, inputClasses } from "./form"

  interface Props {
    label: string|Snippet,
    name: string,
    id?: string,
    value?: boolean | null,
    [key: string]: unknown
  }

  const CTX: any = getContext('FORM') ?? {}

  let {
    label,
    name,
    id = generateToken(),
    value = null,
    animate = CTX?.animate ?? "normal",
    labelClasses  = CTX?.labelClasses ?? "",
    rounded = CTX?.rounded ?? "md",
    size = CTX?.size ?? "md",
    reset = CTX?.reset ?? false,
    ...props
  }: Props & INPUT_CONFIG = $props()

  let C:INPUT_CONFIG & {id: string, type: "group"} = {animate, labelClasses, rounded, size, reset, id, type: "group"}
</script>

<label for={id}
  class="inline-flex gap-x-2 items-center {inputContainerClass(C, {props}, "group")}"
  class:flex-row-reverse={props?.reverse}
  class:justify-end={props?.reverse}
  class:items-center={C?.size!="lg"}
  class:items-start={C?.size=="lg"}>
  <input {...props} class={inputClasses(C, props, "checkbox")} class:sr-only={props?.custom} {id} {name} type="checkbox" bind:checked={value}>
  {#if typeof label == "string"}
    {@html label}
  {/if}
  {#if typeof label == "function"}
    {@render label?.()}
  {/if}
</label>