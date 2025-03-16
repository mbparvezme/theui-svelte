<script lang="ts">
  import type { INPUT_CONFIG, INPUT_TYPE } from "$lib/types"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses } from "./form"
  import { getContext, setContext, type Snippet } from "svelte"
  import { HelperText, Label } from "$lib"
	import { twMerge } from "tailwind-merge";

  interface Props {
    children?: Snippet,
    type?: INPUT_TYPE,
    value?: string,
    helperText?: Snippet|string,
    labelClasses?: string,
    wrapperClasses?: string,
    [key: string] : unknown
  }

  const CTX: any = getContext('FORM') ?? {}

  let {
    children,
    type = "text",
    variant = CTX?.variant ?? "bordered",
    floatingLabel = CTX?.floatingLabel ?? CTX?.variant == "flat" ?? false,
    value,
    size = CTX?.size ?? "md",
    helperText,
    rounded = CTX?.rounded ?? "md",
    animate = CTX?.animate ?? "normal",
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    reset = CTX?.reset ?? false,
    ...props
  } : Props & INPUT_CONFIG = $props()

  const id = generateToken()
  let C:INPUT_CONFIG & {type: "input"} = {animate, floatingLabel, labelClasses, rounded, size, variant, reset, type: "input"}
  setContext('FORM', C)

  let setType: any = (node: HTMLInputElement) => node.type = type
</script>

<div class={twMerge(inputContainerClass(C, true ), wrapperClasses)}>
  {#if !floatingLabel && children}
    <Label for={props?.id ?? id} class={labelClasses}>{@render children()}</Label>
  {/if}
  <div class="relative flex focus-within">
    {#if type == "textarea"}
      <textarea {id} {...props} class={inputClasses(C, props)} placeholder={(props?.placeholder ?? " ") as string} rows=1 bind:value></textarea>
    {:else}
      <input {...props} class={inputClasses(C, props)} {id} placeholder={props?.placeholder ?? " "} bind:value use:setType/>
    {/if}
    {#if floatingLabel && children}
      <Label for={props?.id ?? id} class={labelClasses}>{@render children()}</Label>
    {/if}
  </div>
  {#if helperText}
    {#if typeof helperText == "string"}
      <HelperText>{helperText}</HelperText>
    {/if}
    {#if typeof helperText == "function"}
      {@render helperText?.()}
    {/if}
  {/if}
</div>
