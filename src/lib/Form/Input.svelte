<script lang="ts">
  import type { INPUT_CONFIG, INPUT_TYPE } from "$lib/types"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses } from "./form.ts"
  import { getContext, setContext, type Snippet } from "svelte"
  import { HelperText, Label } from "$lib"
	import { twMerge } from "tailwind-merge"

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
    value,
    helperText,

    variant = CTX?.variant ?? "bordered",
    floatingLabel = CTX?.floatingLabel ?? variant == "flat" ?? false,
    size = CTX?.size ?? "md",
    rounded = CTX?.rounded ?? "md",
    animationSpeed = CTX?.animationSpeed ?? "normal",

    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    reset = CTX?.reset ?? false,
    ...props
  } : Props & INPUT_CONFIG = $props()

  const id: string = props?.id as string ?? generateToken()
  let C:INPUT_CONFIG & {type: "input", inputType: INPUT_TYPE} = {animationSpeed, floatingLabel, labelClasses, rounded, size, variant, reset, type: "input", inputType: type}
  setContext('FORM', C)

  let setType: any = (node: HTMLInputElement) => node.type = type
</script>

<div class={twMerge(inputContainerClass(C, true ), wrapperClasses)}>
  {#if children && !floatingLabel}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div class="relative flex focus-within">
    {#if type == "textarea"}
      <textarea {id} rows=3 {...props} class={inputClasses(C, props)} placeholder={(props?.placeholder ?? " ") as string} bind:value aria-describedby={helperText ? `${id}-helper` : null}></textarea>
    {:else}
      <input {id} {...props} class={inputClasses(C, props)} placeholder={props?.placeholder ?? " "} bind:value use:setType aria-describedby={helperText ? `${id}-helper` : null}/>
    {/if}
    {#if floatingLabel && children}
      <Label for={id} class={labelClasses}>{@render children()}</Label>
    {/if}
  </div>

  {#if helperText}
    <HelperText id={id + "-helper"}>
      {#if typeof helperText === "function"} {@render helperText()}
      {:else} {@html helperText} {/if}
    </HelperText>
  {/if}
</div>
