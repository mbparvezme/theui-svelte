<script lang="ts">
  import { getContext, onDestroy, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { DROPZONE_REJECTION, INPUT_CONFIG, INPUT_SIZE } from "$lib/types"
  import { generateToken, roundedClass, coreReset } from "$lib/function"
  import { fileSize, inputContainerClass, matchesAccept } from "$lib/Form/form"
  import { Close, HelperText, Label, Svg } from "$lib"

  interface Props {
    children?: Snippet,
    content?: Snippet,
    files?: FileList,
    multiple?: boolean,
    accept?: string,
    maxSize?: number,
    maxFiles?: number,
    preview?: boolean,
    showList?: boolean,
    text?: string,
    hint?: string,
    onreject?: (rejections: DROPZONE_REJECTION[]) => void,
    onselect?: (files: File[]) => void,
    helperText?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    dropzoneClasses?: string,
    listClasses?: string,
    [key: string]: unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    content,
    files = $bindable(),
    multiple = false,
    accept,
    maxSize,
    maxFiles,
    preview = true,
    showList = true,
    text = "Drop files here or click to browse",
    hint,
    onreject,
    onselect,
    helperText,
    size = CTX?.size ?? "md",
    rounded = CTX?.rounded ?? "md",
    reset = CTX?.reset ?? coreReset(),
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    dropzoneClasses = "",
    listClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  // How tall the drop area is and how big the text inside it reads
  const SIZES: Record<INPUT_SIZE, string> = {
    sm: "gap-1 p-4 text-sm",
    md: "gap-2 p-6",
    lg: "gap-3 p-8 text-lg",
    xl: "gap-4 p-10 text-xl",
  }

  const fallbackId = generateToken()
  const id = $derived((props.id as string | undefined) ?? fallbackId)
  const C: INPUT_CONFIG = $derived({ rounded, size, reset })
  const locked = $derived(!!props?.disabled || !!props?.readonly)

  let input: HTMLInputElement | undefined = $state()
  let dragging = $state(false)
  const selected = $derived(files ? Array.from(files) : [])

  // Object URLs are freed when the list changes and when the component goes away
  let urls: string[] = []
  const previews = $derived.by(() => {
    urls.forEach(URL.revokeObjectURL)
    urls = []
    if (!preview) return []
    return selected.map(file => {
      if (!file.type.startsWith("image/")) return ""
      const url = URL.createObjectURL(file)
      urls.push(url)
      return url
    })
  })
  onDestroy(() => urls.forEach(URL.revokeObjectURL))

  const apply = (incoming: File[]) => {
    if (locked || !incoming.length) return
    const rejected: DROPZONE_REJECTION[] = []
    const kept: File[] = multiple ? [...selected] : []

    for (const file of incoming) {
      if (accept && !matchesAccept(file, accept)) { rejected.push({ file, reason: "type" }); continue }
      if (maxSize && file.size > maxSize) { rejected.push({ file, reason: "size" }); continue }
      if (!multiple) { kept.length = 0; kept.push(file); continue }
      if (maxFiles && kept.length >= maxFiles) { rejected.push({ file, reason: "count" }); continue }
      kept.push(file)
    }

    const data = new DataTransfer()
    kept.forEach(file => data.items.add(file))
    if (input) input.files = data.files
    files = data.files
    if (kept.length) onselect?.(kept)
    if (rejected.length) onreject?.(rejected)
  }

  const remove = (index: number) => {
    const data = new DataTransfer()
    selected.filter((_, i) => i !== index).forEach(file => data.items.add(file))
    if (input) input.files = data.files
    files = data.files
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    dragging = false
    apply(Array.from(e.dataTransfer?.files ?? []))
  }
</script>

<div class={twMerge(inputContainerClass(C, true), wrapperClasses)}>
  {#if children}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <label
    for={id}
    class={twMerge(`theui-dropzone flex flex-col items-center justify-center text-center ${SIZES[size as INPUT_SIZE] ?? SIZES.md}`,
      // reset keeps the layout and the size, and drops the look, the same as the other inputs
      !reset && `border-2 border-dashed ${roundedClass(rounded)} has-[input:focus-visible]:border-brand-500 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-brand-500`,
      !reset && (dragging ? "border-brand-500 bg-brand-500/10" : "border-gray-300 dark:border-gray-600"),
      !reset && (locked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-secondary"),
      dropzoneClasses)}
    ondragenter={(e) => { e.preventDefault(); if (!locked) dragging = true }}
    ondragover={(e) => { e.preventDefault(); if (!locked) dragging = true }}
    ondragleave={(e) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) dragging = false }}
    ondrop={onDrop}
  >
    <input
      bind:this={input}
      {id}
      type="file"
      {multiple}
      {accept}
      {...props}
      class="sr-only"
      aria-describedby={helperText ? `${id}-helper` : null}
      onchange={(e) => apply(Array.from((e.currentTarget as HTMLInputElement).files ?? []))}
    />

    {#if content}
      {@render content()}
    {:else}
      <Svg size={1.75} class="text-muted" aria-hidden="true">
        <path d="M8 2a.5.5 0 0 1 .354.146l3 3a.5.5 0 0 1-.708.708L8.5 3.707V10a.5.5 0 0 1-1 0V3.707L5.354 5.854a.5.5 0 1 1-.708-.708l3-3A.5.5 0 0 1 8 2z"/>
        <path d="M2 10.5a.5.5 0 0 1 .5.5v1.5A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V11a.5.5 0 0 1 1 0v1.5A2.5 2.5 0 0 1 12 15H4a2.5 2.5 0 0 1-2.5-2.5V11a.5.5 0 0 1 .5-.5z"/>
      </Svg>
      <span class="font-medium">{text}</span>
      {#if hint}<span class="text-sm text-muted">{hint}</span>{/if}
    {/if}
  </label>

  {#if showList && selected.length}
    <ul class={twMerge("theui-dropzone-list flex flex-col gap-2", listClasses)}>
      {#each selected as file, i (file.name + file.size + file.lastModified)}
        <li class="flex items-center gap-3 {roundedClass(rounded)} bg-secondary p-2">
          {#if preview && previews[i]}
            <img src={previews[i]} alt="" class="size-10 shrink-0 rounded object-cover" />
          {/if}
          <span class="min-w-0 grow truncate text-sm">{file.name}</span>
          <span class="shrink-0 text-xs text-muted">{fileSize(file.size)}</span>
          {#if !locked}
            <Close size={1} ariaLabel="Remove {file.name}" onclick={() => remove(i)} />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

  {#if helperText}
    <HelperText id={id + "-helper"}>
      {#if typeof helperText === "function"}
        {@render helperText()}
      {:else}
        {helperText}
      {/if}
    </HelperText>
  {/if}
</div>
