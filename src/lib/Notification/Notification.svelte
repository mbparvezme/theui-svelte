<script lang="ts">
  import { fade, fly } from "svelte/transition"
  import { ST_NOTIFICATIONS, removeNotification } from "$lib/state.svelte"
  import { notificationClasses, type NOTIFICATION_POSITION } from "$lib/function"

  let {position = "top-end", animate = true} : {position?: NOTIFICATION_POSITION, animate?: boolean} = $props()
</script>

{#if ST_NOTIFICATIONS?.value?.length}
<ul class="theui-notifications z-[70] fixed list-none flex flex-col p-4 gap-y-4 {position}">
  {#each ST_NOTIFICATIONS.value as notification}
  <li class="notification">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    {#if animate}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div class={notificationClasses(notification.CONFIG, notification.type)} role="alert" aria-live="assertive" aria-atomic="true" in:fly={{ y: 16 }} out:fade onclick={() => {notification.CONFIG.removeOnClick===false ? false : removeNotification(notification.CONFIG.id)}}>
        <span role="alert" aria-live="assertive" aria-atomic="true">{@html notification.msg}</span>
      </div>
    {:else}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div class={notificationClasses(notification.CONFIG, notification.type)} role="alert" aria-live="assertive" aria-atomic="true" onclick={() => {notification.CONFIG.removeOnClick === false ? false : removeNotification(notification.CONFIG.id)}}>
        <span role="alert" aria-live="assertive" aria-atomic="true">{@html notification.msg}</span>
      </div>
    {/if}
  </li>
  {/each}
</ul>
{/if}

<style lang="postcss">
  .theui-notifications.top-start, .theui-notifications.top-center, .theui-notifications.top-end{
    @apply justify-start top-0;
  }
  .theui-notifications.bottom-start, .theui-notifications.bottom-center, .theui-notifications.bottom-end{
    @apply justify-end bottom-0;
  }
  .theui-notifications.bottom-center, .theui-notifications.top-center{
    @apply items-center start-0 end-0 w-full;
  }
  .theui-notifications.bottom-end, .theui-notifications.top-end{
    @apply items-end end-0;
  }
  .theui-notifications.bottom-start, .theui-notifications.top-start{
    @apply items-start start-0;
  }
  /*.theui-notifications.top-start .notification, .theui-notifications.top-center .notification, .theui-notifications.top-end .notification{
    @apply mb-4;
  }
  .theui-notifications.bottom-start .notification, .theui-notifications.bottom-center .notification, .theui-notifications.bottom-end .notification{
    @apply mt-4;
  }*/
</style>