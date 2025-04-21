<script lang="ts">
	import type { ROUNDED } from "$lib/types"
	import type { Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"
	import { roundedClass, generateToken, messageTheme, messageBarTheme } from "$lib/function"
	import { Close, Svg } from "$lib"

	interface Props {
		children ?: Snippet,
		rounded ?: ROUNDED,
		type ?: 'error' | 'info' | 'success' | 'warning',
		theme ? : 'default'|'light',
		variant ?: 'card' | 'borderTop'| 'borderBottom'| 'borderStart',
		id ?: string,
    [key: string]: unknown // dismissible, icon
	}

	let {
		children,
		rounded = "md",
		type = "error",
		theme = "default",
		variant = "card",
		id = generateToken(),
		...props
	} : Props = $props()

	let nodeRef: HTMLDivElement

	let getClass = () => {
		let baseClass = `theui-alert flex items-center p-4 mb-4 gap-4 text-sm font-medium dark:font-normal ${messageTheme[theme][type]}`
		const variantClasses = {
			card: roundedClass(rounded),
			borderTop: `${roundedClass(rounded, "bottom")} ${messageBarTheme[theme][type]} border-t-4`,
			borderBottom: `${roundedClass(rounded, "top")} ${messageBarTheme[theme][type]} border-b-4`,
			borderStart: `${roundedClass(rounded)} ${messageBarTheme[theme][type]} border-s-4`
		}
		const variantClass = variantClasses[variant] || ""
		return twMerge(`${baseClass} ${variantClass}`, props?.class as string);
	}

	const toggleAlert = () => {
		nodeRef.parentNode?.removeChild(nodeRef)
	}
</script>

<div {id} class={getClass()} role="alert" bind:this={nodeRef}>
	<!-- Alert Icon -->
	{#if props?.icon && ["error", "info", "success", "warning"].includes(type)}
		{@render commonIcons()}
	{/if}

	<!-- Alert children -->
	{@render children?.()}

	<!-- Alert Close Button -->
	{#if props?.dismissible}
		<div class="ms-auto mb-auto">
			<Close ariaLabel="Close alert" onclick={()=>toggleAlert()} />
		</div>
	{/if}
</div>

<!-- Component Snippet -->
{#snippet commonIcons()}
	<Svg size={1.25}>
		{#if type == "error" || type == "warning"}
			<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
		{/if}
		{#if type == "info"}
			<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
		{/if}
		{#if type == "success"}
			<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
		{/if}
	</Svg>
{/snippet}