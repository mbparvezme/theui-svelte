<script>
  import { Tooltip, Button, Container } from "$lib";
</script>

<p>Read the <a href="https://theui.dev" target="_blank">documentation</a>.</p>

<Tooltip />

<Button data-tooltip="Hello Tooltip Hello Tooltip Hello Tooltip Hello Tooltip" data-tooltip-position="left">Right</Button>

<Container class="px-80">

  <section class="docs-block flex flex-col gap-4 mb-16 scroll-mt-2" id="example">
    <div class="flex items-center gap-2">
      <h2 class="my-0 font-bold text-2xl font-body">Example</h2>
      <span class="not-prose ms-auto flex items-center">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="font-medium w-6 h-6 flex justify-center items-center text-default opacity-40 hover:opacity-100 transition-opacity duration-300 " data-tooltip="Copy link" data-tooltip-position="right">
          <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"></path>
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"></path>
          </svg>
        </button>
      </span>
    </div>
    <div class="example-section">
      <h4 id="import-&amp;-initialize-tooltip" class="not-prose text-xl font-semibold font-body text-gray-700 dark:text-gray-400 mt-0 mb-2">
        Import &amp; Initialize Tooltip
      </h4>
      <p class="not-prose">
        To use the <code>Tooltip</code> component, first import it from theui-svelte. It’s recommended to initialize <code>Tooltip</code> globally, such as in <code>+layout.svelte</code>, to make tooltips available throughout your app. Alternatively, you can include it on specific pages where needed.
      </p>
      <div class="rounded-md mt-4 border border-gray-200 dark:border-gray-800">
        <div id="codetklgn1739729175903" class=" border-gray-200 dark:border-gray-800 rounded-md border-0">
          <div class="bg-slate-100 dark:bg-slate-900 px-4 h-10 w-full flex items-center justify-between rounded-t-md">
            <span class="not-prose text-gray-500 dark:text-gray-400 text-sm mr-auto font-mono">+layout.svelte</span>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class=" font-medium w-[12px] h-[12px]" data-tooltip="Copy code" data-tooltip-position="left">
              <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" class="dark:text-gray-100 hidden"></path>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" class="dark:text-gray-100"></path>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" class="dark:text-gray-100"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="example-section">
      <h4 id="import-&amp;-initialize-tooltip" class="not-prose text-xl font-semibold font-body text-gray-700 dark:text-gray-400 mt-0 mb-2">
        Import &amp; Initialize Tooltip
      </h4>
      <p class="not-prose">
        To use the <code>Tooltip</code> component, first import it from theui-svelte. It’s recommended to initialize <code>Tooltip</code> globally, such as in <code>+layout.svelte</code>, to make tooltips available throughout your app. Alternatively, you can include it on specific pages where needed.
      </p>
      <div class="rounded-md mt-4 border border-gray-200 dark:border-gray-800">
        <div id="codetklgn1739729175903" class=" border-gray-200 dark:border-gray-800 rounded-md border-0">
          <div class="bg-slate-100 dark:bg-slate-900 px-4 h-10 w-full flex items-center justify-between rounded-t-md">
            <span class="not-prose text-gray-500 dark:text-gray-400 text-sm mr-auto font-mono">+layout.svelte</span>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class=" font-medium w-[12px] h-[12px]" data-tooltip="Copy code" data-tooltip-position="left">
              <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" class="dark:text-gray-100 hidden"></path>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" class="dark:text-gray-100"></path>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" class="dark:text-gray-100"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="flex gap-4 mb-16">
    <Button class="" data-tooltip="Hello">Tooltip</Button>
    <Button class="" data-tooltip="Hello">Tooltip</Button>
  </div>

  <section class="docs-block flex flex-col gap-4 mb-16 scroll-mt-2" id="example">
    <div class="flex items-center gap-2">
      <h2 class="my-0 font-bold text-2xl font-body">Example</h2>
      <span class="not-prose ms-auto flex items-center">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="font-medium w-6 h-6 flex justify-center items-center text-default opacity-40 hover:opacity-100 transition-opacity duration-300 " data-tooltip="Copy link" data-tooltip-position="right">
          <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"></path>
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"></path>
          </svg>
        </button>
      </span>
    </div>
    <div class="example-section">
      <h4 id="import-&amp;-initialize-tooltip" class="not-prose text-xl font-semibold font-body text-gray-700 dark:text-gray-400 mt-0 mb-2">
        Import &amp; Initialize Tooltip
      </h4>
      <p class="not-prose">
        To use the <code>Tooltip</code> component, first import it from theui-svelte. It’s recommended to initialize <code>Tooltip</code> globally, such as in <code>+layout.svelte</code>, to make tooltips available throughout your app. Alternatively, you can include it on specific pages where needed.
      </p>
      <div class="rounded-md mt-4 border border-gray-200 dark:border-gray-800">
        <div id="codetklgn1739729175903" class=" border-gray-200 dark:border-gray-800 rounded-md border-0">
          <div class="bg-slate-100 dark:bg-slate-900 px-4 h-10 w-full flex items-center justify-between rounded-t-md">
            <span class="not-prose text-gray-500 dark:text-gray-400 text-sm mr-auto font-mono">+layout.svelte</span>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class=" font-medium w-[12px] h-[12px]" data-tooltip="Copy code" data-tooltip-position="left">
              <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" class="dark:text-gray-100 hidden"></path>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" class="dark:text-gray-100"></path>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" class="dark:text-gray-100"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="example-section">
      <h4 id="import-&amp;-initialize-tooltip" class="not-prose text-xl font-semibold font-body text-gray-700 dark:text-gray-400 mt-0 mb-2">
        Import &amp; Initialize Tooltip
      </h4>
      <p class="not-prose">
        To use the <code>Tooltip</code> component, first import it from theui-svelte. It’s recommended to initialize <code>Tooltip</code> globally, such as in <code>+layout.svelte</code>, to make tooltips available throughout your app. Alternatively, you can include it on specific pages where needed.
      </p>
      <div class="rounded-md mt-4 border border-gray-200 dark:border-gray-800">
        <div id="codetklgn1739729175903" class=" border-gray-200 dark:border-gray-800 rounded-md border-0">
          <div class="bg-slate-100 dark:bg-slate-900 px-4 h-10 w-full flex items-center justify-between rounded-t-md">
            <span class="not-prose text-gray-500 dark:text-gray-400 text-sm mr-auto font-mono">+layout.svelte</span>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class=" font-medium w-[12px] h-[12px]" data-tooltip="Copy code" data-tooltip-position="left">
              <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" class="dark:text-gray-100 hidden"></path>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" class="dark:text-gray-100"></path>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" class="dark:text-gray-100"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="flex gap-4 mb-16">
    <Button class="" data-tooltip="Hello">Tooltip</Button>
    <Button class="" data-tooltip="Hello">Tooltip</Button>
  </div>

  <section class="docs-block flex flex-col gap-4 mb-16 scroll-mt-2" id="example">
    <div class="flex items-center gap-2">
      <h2 class="my-0 font-bold text-2xl font-body">Example</h2>
      <span class="not-prose ms-auto flex items-center">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="font-medium w-6 h-6 flex justify-center items-center text-default opacity-40 hover:opacity-100 transition-opacity duration-300 " data-tooltip="Copy link" data-tooltip-position="right">
          <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"></path>
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"></path>
          </svg>
        </button>
      </span>
    </div>
    <div class="example-section">
      <h4 id="import-&amp;-initialize-tooltip" class="not-prose text-xl font-semibold font-body text-gray-700 dark:text-gray-400 mt-0 mb-2">
        Import &amp; Initialize Tooltip
      </h4>
      <p class="not-prose">
        To use the <code>Tooltip</code> component, first import it from theui-svelte. It’s recommended to initialize <code>Tooltip</code> globally, such as in <code>+layout.svelte</code>, to make tooltips available throughout your app. Alternatively, you can include it on specific pages where needed.
      </p>
      <div class="rounded-md mt-4 border border-gray-200 dark:border-gray-800">
        <div id="codetklgn1739729175903" class=" border-gray-200 dark:border-gray-800 rounded-md border-0">
          <div class="bg-slate-100 dark:bg-slate-900 px-4 h-10 w-full flex items-center justify-between rounded-t-md">
            <span class="not-prose text-gray-500 dark:text-gray-400 text-sm mr-auto font-mono">+layout.svelte</span>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class=" font-medium w-[12px] h-[12px]" data-tooltip="Copy code" data-tooltip-position="left">
              <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" class="dark:text-gray-100 hidden"></path>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" class="dark:text-gray-100"></path>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" class="dark:text-gray-100"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="example-section">
      <h4 id="import-&amp;-initialize-tooltip" class="not-prose text-xl font-semibold font-body text-gray-700 dark:text-gray-400 mt-0 mb-2">
        Import &amp; Initialize Tooltip
      </h4>
      <p class="not-prose">
        To use the <code>Tooltip</code> component, first import it from theui-svelte. It’s recommended to initialize <code>Tooltip</code> globally, such as in <code>+layout.svelte</code>, to make tooltips available throughout your app. Alternatively, you can include it on specific pages where needed.
      </p>
      <div class="rounded-md mt-4 border border-gray-200 dark:border-gray-800">
        <div id="codetklgn1739729175903" class=" border-gray-200 dark:border-gray-800 rounded-md border-0">
          <div class="bg-slate-100 dark:bg-slate-900 px-4 h-10 w-full flex items-center justify-between rounded-t-md">
            <span class="not-prose text-gray-500 dark:text-gray-400 text-sm mr-auto font-mono">+layout.svelte</span>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class=" font-medium w-[12px] h-[12px]" data-tooltip="Copy code" data-tooltip-position="left">
              <svg width="1rem" height="1rem" viewBox="0 0 16 16" focusable="true" class="theui-svg-icon shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" class="dark:text-gray-100 hidden"></path>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" class="dark:text-gray-100"></path>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" class="dark:text-gray-100"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="flex gap-4 mb-16">
    <Button class="" data-tooltip="Hello">Tooltip</Button>
    <Button class="" data-tooltip="Hello">Tooltip</Button>
  </div>

<div class="text-center py-48">
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!">Top (Default) tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="top-start">Top start tooltip start tooltip start tooltip </button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="top-end">Top end tooltip end tooltip end tooltip end tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="bottom">Bottom (Default) tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="bottom-start">Bottom start tooltip start tooltip start tooltip </button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="bottom-end">Bottom end tooltip end tooltip end tooltip end tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="left">Left tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="left-start">Left start tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="left-end">Left end tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="right">right tooltip right tooltip right tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="right-start">right start tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b><br>Hello world!<br>Hello world!"  data-tooltip-position="right-end">right end tooltip</button></p>
</div>
<div class=" h-screen"></div>

</Container>