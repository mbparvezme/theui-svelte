<script lang="ts">
  import { fade, fly } from "svelte/transition"
  import type { NOTIFICATION_POSITION } from "$lib/types"
  import { notificationClasses, removeNotification, sanitize } from "$lib/function"
  import { ST_NOTIFICATIONS } from "$lib/state.svelte"

  let {position = "top-end", animationSpeed = true} : {position?: NOTIFICATION_POSITION, animationSpeed?: boolean} = $props()

  const classes: Record<NOTIFICATION_POSITION, string> = {
    "top-end": "justify-start items-end end-0",
    "top-center": "justify-start items-center start-0 end-0 w-full",
    "top-start": "justify-start items-start start-0",
    "bottom-end": "justify-end items-end end-0",
    "bottom-center": "justify-end items-center start-0 end-0 w-full",
    "bottom-start": "justify-end items-start start-0"
  }
  const positionClasses = () => classes[position]
</script>

{#if ST_NOTIFICATIONS?.value?.length}
<ul class="theui-notifications z-700 fixed list-none flex flex-col p-4 gap-y-4 {positionClasses()}">
  {#each ST_NOTIFICATIONS.value as notification (notification.CONFIG.id)}
  <li class="notification">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class={notificationClasses(notification.CONFIG, notification.type)} role="alert" aria-live="assertive" aria-atomic="true" onclick={() => notification.CONFIG.removeOnClick === false ? false : removeNotification(notification.CONFIG.id)}
      in:fly={animationSpeed ? { y: 16 } : { duration: 0 }}
      out:fade={animationSpeed ? {} : { duration: 0 }}
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html sanitize(notification.msg)}
    </div>
  </li>
  {/each}
</ul>
{/if}
