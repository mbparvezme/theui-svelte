<script lang="ts">
  import { getContext, type Snippet } from "svelte"
	import type { MOBILE_NAV_ON, RESPONSIVE_NAV_ON } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, generateToken } from "$lib/function"
  import { Svg } from "$lib"

  const { config } = getContext('NAV') as any
  config.isDropdown = true

  interface Props {
    children?: Snippet,
    label : string|Snippet,
    align?: 'start'|'end',
    width?: MOBILE_NAV_ON | 'full',
    dropdownEvent ?: 'hover' | 'click',
    animation?: 'fade'|'slide'|'zoom',
    arrowIcon?: Snippet|boolean,
    [key: string]: unknown
  }

  let{
    children,
    label,
    align = "start",
    width = "sm",
    dropdownEvent = config.dropdownEvent,
    animation = "fade",
    arrowIcon = true,
    ...props
  } : Props = $props()

  let id: string = generateToken()

  let menuWidthClasses: Record<MOBILE_NAV_ON | 'nonRes', Record<MOBILE_NAV_ON | 'full', string>> = {
    sm: {
      sm: "md:w-48",
      md: "md:w-60",
      lg: "md:w-80",
      xl: "md:w-96",
      full: "mega-menu md:inset-x-0",
    },
    md: {
      sm: "lg:w-48",
      md: "lg:w-60",
      lg: "lg:w-80",
      xl: "lg:w-96",
      full: "mega-menu lg:inset-x-0",
    },
    lg: {
      sm: "xl:w-48",
      md: "xl:w-60",
      lg: "xl:w-80",
      xl: "xl:w-96",
      full: "mega-menu xl:inset-x-0",
    },
    xl: {
      sm: "2xl:w-48",
      md: "2xl:w-60",
      lg: "2xl:w-80",
      xl: "2xl:w-96",
      full: "mega-menu 2xl:inset-x-0",
    },
    nonRes: {
      sm: "w-48",
      md: "w-60",
      lg: "w-80",
      xl: "w-96",
      full: "w-full inset-x-0",
    }
  }

  let nonResCls = `absolute pl-0 flex shadow-xl block w-80 max-h-[80vh] ${menuWidthClasses["nonRes"][width]}`

  let dropdownTopPositionClasses: Record<'sm' | 'md' | 'lg' | 'xl', String> = {
    sm: "top-full",
    md: "top-full",
    lg: "top-[calc(100%_+_4px)]",
    xl: "top-[calc(100%_+_12px)]",
  }

  let resCls = () => {
    let collapseClasses: RESPONSIVE_NAV_ON = {
      sm: "md-collapse md:absolute md:flex md:shadow-xl md:block",
      md: "lg-collapse lg:absolute lg:flex lg:shadow-xl lg:block",
      lg: "xl:absolute xl:flex xl:shadow-xl xl:block",
      xl: "2xl:absolute 2xl:flex 2xl:shadow-xl 2xl:block",
    }

    let dropdownMaxHeight: RESPONSIVE_NAV_ON = {
      sm: "md:max-h-[80vh]",
      md: "lg:max-h-[80vh]",
      lg: "xl:max-h-[80vh]",
      xl: "2xl:max-h-[80vh]",
    }

    return `shadow-none hidden 
            ${collapseClasses[config.mobileNavOn as MOBILE_NAV_ON]}
            ${dropdownMaxHeight[config.mobileNavOn as MOBILE_NAV_ON]}
            ${menuWidthClasses[config?.mobileNavOn as MOBILE_NAV_ON || "md"][width]}`
  }

  let dropdownClasses = `nav-dropdown flex-col py-2 bg-secondary overflow-y-auto
  ${width != "full" ? (align=="end" ? "end-0" : "start-0") : ""}
  ${config?.responsive ? resCls() : nonResCls} ${dropdownTopPositionClasses[config.height as MOBILE_NAV_ON]}
  ${roundedClass(config?.rounded, "bottom")}${animationClass(config.animate)}`

  let toggle = () => {
    if(dropdownEvent !== "hover"){
      let dd = document.getElementById(id)
      if(dd?.classList.contains("hide")){
        let activeDd = document.querySelectorAll(".theui-nav-dropdown-container:not(.hide)")
        activeDd.forEach(elm => elm.classList.add("hide"))
        dd.classList.remove("hide")
      }else{
        dd?.classList.add("hide")
      }
    }
  }

  let handleMouse = (e: Event) => {
    if(dropdownEvent === "hover"){
      e.preventDefault()
      let dd = document.getElementById(id)
      if (e.type === "mouseenter" || e.type === "focus") {
        dd?.classList.remove("hide")
      } else if (e.type === "mouseleave") {
        dd?.classList.add("hide")
      }
    }
	}

  let handleKeyboard = (e: KeyboardEvent) => {
    if(e.code == "Escape" || e.code == "ArrowUp"){
      e.preventDefault()
      document.getElementById(id)?.classList.add("hide")
    }
    if(e.code == "ArrowDown"){
      e.preventDefault()
      document.getElementById(id)?.classList.remove("hide")
    }
    return
	}

  let handleBlur = (e: Event) => {
    if((e.target as HTMLElement).closest("#"+id+":not(.hide)") === null){
      document.getElementById(id)?.classList.add("hide")
    }
    return
  }
</script>

<svelte:window on:click={(e)=>handleBlur(e)}/>

<div {id} {...props} class="theui-nav-dropdown-container hide z-[1]" class:relative={width != "full"} tabindex="-1" onmouseenter={(e)=>handleMouse(e)} onmouseleave={(e)=>handleMouse(e)} onblur={(e)=>handleBlur(e)}>
  <button class="theui-nav-dropdown-btn gap-x-1 w-full justify-between flex items-center {config.linkClasses}" onkeydown={(e)=>handleKeyboard(e)} onclick={()=>toggle()} onfocus={handleMouse}>
    {#if label}
      {#if typeof label == "function"}
        {@render label()}
      {:else}
        {@html label}
      {/if}
    {/if}

    {#if arrowIcon} 
      {#if arrowIcon === true}
        <Svg stroke={true} viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></Svg>
      {:else}
        {@render arrowIcon?.()}
      {/if}
    {/if}
  </button>

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div  class="theui-nav-dropdown {twMerge(dropdownClasses, props?.class as string)}"
        class:fade={animation=="fade"} class:slide={animation=="slide"}
        class:zoom={animation=="zoom"} onclick={()=>toggle()}>
    {@render children?.()}
  </div>
</div>

<style lang="postcss">
  .theui-nav-dropdown-container.hide .nav-dropdown{
    @apply invisible;
  }
  .theui-nav-dropdown-container.hide .nav-dropdown.fade{
    @apply opacity-0;
  }
  .theui-nav-dropdown-container.hide .nav-dropdown.slide{
    @apply opacity-0 translate-y-8;
  }
  .theui-nav-dropdown-container.hide .nav-dropdown.zoom{
    @apply opacity-0 scale-75;
  }
  .theui-nav-dropdown-container:not(.hide){
    @apply visible block opacity-100;
  }
  .theui-nav-dropdown-container:not(.hide) .nav-dropdown{
    @apply visible block opacity-100;
  }
  .theui-nav-dropdown-container:not(.hide) .nav-dropdown.fade, .theui-nav-dropdown-container:not(.hide) .nav-dropdown.slide{
    @apply translate-y-0;
  }
  .theui-nav-dropdown-container:not(.hide) .nav-dropdown.zoom{
    @apply scale-100;
  }
</style>