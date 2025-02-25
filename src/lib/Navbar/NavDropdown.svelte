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
    label : string,
    icon?: Snippet|boolean,
    align?: 'start'|'end',
    width?: MOBILE_NAV_ON | 'full',
    animation?: 'fade'|'slide-up'|'zoom-in',
    dropdownEvent ?: 'hover' | 'click',
    [key: string]: unknown
  }

  let{
    label,
    children,
    icon = true,
    align = "end",
    width = "sm",
    animation = "fade",
    dropdownEvent = config.dropdownEvent,
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
      full: "w-full start-0 end-0",
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
    // object
    let collapseClasses: RESPONSIVE_NAV_ON = {
      sm: "md-collapse md:absolute md:flex md:shadow-xl md:block dark:md:bg-tertiary",
      md: "lg-collapse lg:absolute lg:flex lg:shadow-xl lg:block dark:lg:bg-tertiary",
      lg: "xl:absolute xl:flex xl:shadow-xl xl:block dark:xl:bg-tertiary",
      xl: "2xl:absolute 2xl:flex 2xl:shadow-xl 2xl:block dark:2xl:bg-tertiary",
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

  let dropdownClasses = `nav-dropdown flex-col py-2 bg-primary dark:bg-secondary overflow-y-auto
  ${roundedClass(config?.rounded, "bottom")}
  ${animationClass(config.animate)} 
  ${width != "full" ? (align=="end" ? "end-0" : "start-0") : ""}
  ${dropdownTopPositionClasses[config.height as MOBILE_NAV_ON]} ${config?.responsive ? resCls() : nonResCls} ${animationClass(config?.animate)} ${roundedClass(config?.rounded)}`

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

  let handleMouse = (e: MouseEvent) => {
    if(dropdownEvent === "hover"){
      e.preventDefault()
      document.getElementById(id)?.classList.toggle("hide")
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

  let handleBlur = (e: MouseEvent) => {
    if((e.target as HTMLElement).closest("#"+id+":not(.hide)") === null){
      document.getElementById(id)?.classList.add("hide")
    }
    return
  }
</script>

<svelte:window on:click={(e)=>handleBlur(e)}/>

<div {id} {...props} class="theui-nav-dropdown-container hide z-[1]" class:relative={width != "full"}>
  <button class="theui-nav-dropdown-btn gap-x-1 w-full justify-between flex items-center {config.linkClasses}" onmouseenter={(e)=>handleMouse(e)} onmouseleave={(e)=>handleMouse(e)} onkeydown={(e)=>handleKeyboard(e)} onclick={()=>toggle()}>
    {#if label}
      {@html label}
    {:else if children}
      {@render children()}
    {/if}

    {#if icon}
      {#if icon === true}
        <Svg stroke={true} viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></Svg>
      {:else}
        {@render icon?.()}
      {/if}
    {/if}
  </button>

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div  class="nav-dropdown {twMerge(dropdownClasses, props?.class as string)}"
        class:fade={animation=="fade"}
        class:slide-up={animation=="slide-up"}
        class:zoom-in={animation=="zoom-in"}
        onclick={()=>toggle()}>
      {@render children?.()}
  </div>

</div>

<style lang="postcss">
  .theui-nav-dropdown-container.hide .nav-dropdown{
    @apply invisible;
  }
  .theui-nav-dropdown-container.hide .nav-dropdown.fade{
    @apply opacity-0 translate-y-2;
  }
  .theui-nav-dropdown-container.hide .nav-dropdown.slide-up{
    @apply opacity-0 translate-y-8;
  }
  .theui-nav-dropdown-container.hide .nav-dropdown.zoom-in{
    @apply opacity-0 scale-75;
  }
  .theui-nav-dropdown-container:not(.hide){
    @apply visible block opacity-100 translate-y-0;
  }
  .theui-nav-dropdown-container:not(.hide) .nav-dropdown{
    @apply visible block opacity-100;
  }
  .theui-nav-dropdown-container:not(.hide) .nav-dropdown.fade,
  .theui-nav-dropdown-container:not(.hide) .nav-dropdown.slide-up{
    @apply translate-y-0;
  }
  .theui-nav-dropdown-container:not(.hide) .nav-dropdown.zoom-in{
    @apply scale-100;
  }
</style>