<script lang="ts">
  import type { INPUT_CONFIG, INPUT_TYPE, SELECT_DATA } from "$lib/types"
  import { getContext, setContext, type Snippet } from "svelte"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses } from "./form"
  import { Label, HelperText, Input } from "$lib"

  const CTX: any = getContext('FORM') ?? {}

  interface Props {
    options: SELECT_DATA[]|Snippet,
    label?: Snippet|string|undefined,
    helperText ?: Snippet|string|undefined,
    id?: string,
    name: string,
    type?: INPUT_TYPE,
    value?: string|number,
    [key: string] : unknown
  }

  let {
    options = [],
    helperText = undefined,
    id = generateToken(),
    label = undefined,
    name = "",
    type = "text",
    value = "",
    animationSpeed = CTX?.animationSpeed ?? "normal",
    floatingLabel = CTX?.floatingLabel ?? CTX?.variant == "flat" ?? false,
    labelClasses = CTX?.labelClasses ?? "",
    rounded = CTX?.rounded ?? "md",
    size = CTX?.size ?? "md",
    variant = CTX?.variant ?? "bordered",
    reset = CTX?.reset ?? false,
    ...props
  } : Props & INPUT_CONFIG = $props()

  let C:INPUT_CONFIG & {id: string, type: "input"} = {animationSpeed, floatingLabel, labelClasses, rounded, size, variant, reset, id, type: "input"}
  setContext('FORM', C)
</script>

{#snippet labelContent()}
  {#if typeof label == "string"}
    <Label {id} {label} />
  {/if}
  {#if typeof label == "function"}
    {@render label?.()}
  {/if}
{/snippet}

<div class={inputContainerClass(C, props)}>
  {#if label && !floatingLabel}
    {@render labelContent()}
  {/if}

  <div class="relative flex focus-within">
    {#if props?.readonly ||  props?.disabled}
      {#if value}
        <Input {id}  {name} readonly {value} class={inputClasses(C, props, "select")}/>
      {:else}
        {#if typeof options != "function"}
          {#if options?.length > 0}
            {#each options as d}
              {#if typeof d === 'object' && d !== null}
                <Input {id} {name} readonly value={d?.value??""} class={inputClasses(C, props, "select")}/>
              {/if}
              {#if typeof d === 'string'}
                <Input {id} {name} readonly value={d} class={inputClasses(C, props, "select")}/>
              {/if}
            {/each}
          {/if}
        {/if}
      {/if}
    {:else}
      <select {id} {name} {...props} class={inputClasses(C, props, "select")} bind:value>
        {#if props?.placeholder}<option value="">{props.placeholder}</option>{/if}
        {#if typeof options != "function"}
          {#if options?.length > 0}
            {#each options as d}
              {#if typeof d === 'object' && d !== null}
                <option value={d?.value??d.text}>{d.text}</option>
              {/if}
              {#if typeof d === 'string'}
                <option value={d}>{d}</option>
              {/if}
            {/each}
          {/if}
        {:else}
          {@render options()}
        {/if}
      </select>
    {/if}
    {#if label && floatingLabel}
      {@render labelContent()}
    {/if}
  </div>

  {#if helperText}
    {#if typeof helperText == "string"}
      <HelperText text={helperText} />
    {/if}
    {#if typeof helperText == "function"}
      {@render helperText?.()}
    {/if}
  {/if}
</div>