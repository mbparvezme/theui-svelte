<script lang="ts">
  import SliderNew from "$lib/Slider/Slider.svelte"
  import SlideNew from "$lib/Slider/Slide.svelte"

  const img = (color: string, text: string) => `https://placehold.co/1600x700/${color}/white?text=${encodeURIComponent(text)}`
  const colors = ["73C7C7", "B5828C", "889E73", "577BC1", "8174A0", "B59F78"]

  // bind:activeSlide and onchange
  let current = $state(2)
  let changes: string[] = $state([])

  // Slides added and removed later
  let dynamic = $state([1, 2, 3])
  let nextId = 4
  const addSlide = () => dynamic.push(nextId++)
  const addFirst = () => dynamic.unshift(nextId++)
  const removeSlide = () => dynamic.pop()

  // Page background
  let pageBackground = $state(false)
  let backgroundPaused = $state(false)

  // Props changed after load
  let live = $state({ autoPlay: true, loop: true, effect: "slide" as "slide" | "fade" | "zoom" | "flip" | "cube", direction: "horizontal" as "horizontal" | "vertical", perView: 1 })
</script>

<svelte:head>
  <title>SliderNew demo</title>
</svelte:head>

{#snippet section(title: string, test: string)}
  <h2 class="text-2xl font-semibold">{title}</h2>
  <p class="text-gray-600 dark:text-gray-400">{test}</p>
{/snippet}

<main class="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-6">
  <header class="flex flex-col gap-2 mb-6">
    <h1 class="text-3xl font-bold">SliderNew: steps 1 to 4</h1>
    <p class="text-gray-600 dark:text-gray-400">Each demo says what to check. Also try every slider with the keyboard (Tab to a control, then arrow keys, Home and End), by dragging with the mouse, and by swiping on a phone.</p>
  </header>

  {@render section("1. Default", "Auto play with timer, pause button, arrows and dots. Hover pauses and resumes where it stopped. Resize the window mid-slide. Tab to a control: auto play stops while keyboard focus is inside.")}
  <SliderNew>
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Slide ${i + 1}`)} alt="Demo slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("2. Custom content, stopOnHover off", "Hovering does not pause. The button inside a slide works, and dragging across it does not click it.")}
  <SliderNew stopOnHover={false} slideDuration={4000}>
    {#each ["bg-yellow-200", "bg-rose-200", "bg-teal-200"] as bg, i (bg)}
      <SlideNew class="{bg} h-72 flex-col gap-4 text-black">
        <h3 class="text-4xl font-bold">Content slide {i + 1}</h3>
        <button type="button" class="px-4 py-2 rounded bg-black text-white" onclick={() => alert(`Clicked in slide ${i + 1}`)}>Click me</button>
      </SlideNew>
    {/each}
  </SliderNew>

  {@render section("3. Fade", "Slides cross-fade. Dragging fades between slides too.")}
  <SliderNew effect="fade" transitionDuration={1000}>
    {#each colors.slice(2, 5) as color, i (color)}
      <SlideNew src={img(color, `Fade ${i + 1}`)} alt="Fade slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("4. Vertical with mousewheel", "Up and Down arrow keys. One wheel or trackpad gesture moves one slide. Arrows at top and bottom, dots on the side.")}
  <SliderNew direction="vertical" mousewheel class="h-80" autoPlay={false}>
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Vertical ${i + 1}`)} alt="Vertical slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("5. Carousel: perView 3, gap 16", "Three slides in view, looping. Dragging from the last to the first slide has no gap or jump.")}
  <SliderNew perView={3} gap={16} slideDuration={3000}>
    {#each colors as color, i (color)}
      <SlideNew src={img(color, `Card ${i + 1}`)} alt="Card {i + 1}" class="rounded-lg" />
    {/each}
  </SliderNew>

  {@render section("6. Carousel without loop, with mousewheel", "perView 2, gap 1rem, no auto play. Prev is disabled at the start and Next at the end. At the ends the wheel scrolls the page again, and dragging past the end resists.")}
  <SliderNew perView={2} gap="1rem" loop={false} autoPlay={false} mousewheel>
    {#each colors.slice(0, 5) as color, i (color)}
      <SlideNew src={img(color, `No loop ${i + 1}`)} alt="No loop slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("7. bind:activeSlide and onchange", "Starts at slide 2. The buttons set the slide from outside, and every change is logged. Setting 99 moves to the last slide.")}
  <div class="flex flex-wrap items-center gap-2">
    <span>activeSlide = <b>{current}</b></span>
    {#each [1, 2, 3, 4, 99] as n (n)}
      <button type="button" class="px-3 py-1 rounded bg-gray-200 text-black" onclick={() => current = n}>Set {n}</button>
    {/each}
  </div>
  <SliderNew bind:activeSlide={current} onchange={(n) => changes = [`changed to ${n}`, ...changes].slice(0, 5)} slideDuration={3000}>
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Bound ${i + 1}`)} alt="Bound slide {i + 1}" />
    {/each}
  </SliderNew>
  <p class="text-sm text-gray-600 dark:text-gray-400">Last changes: {changes.join(", ") || "none yet"}</p>

  {@render section("8. Slides added and removed later", "Dots and slide labels follow. Adding at the start keeps the order. Removing the current last slide moves back.")}
  <div class="flex flex-wrap gap-2">
    <button type="button" class="px-3 py-1 rounded bg-gray-200 text-black" onclick={addSlide}>Add at end</button>
    <button type="button" class="px-3 py-1 rounded bg-gray-200 text-black" onclick={addFirst}>Add at start</button>
    <button type="button" class="px-3 py-1 rounded bg-gray-200 text-black" onclick={removeSlide}>Remove last</button>
  </div>
  <SliderNew autoPlay={false}>
    {#each dynamic as n (n)}
      <SlideNew src={img(colors[n % colors.length], `Dynamic ${n}`)} alt="Dynamic slide {n}" />
    {/each}
  </SliderNew>

  {@render section("9. Props changed after load", "Each change applies at once, without reloading.")}
  <div class="flex flex-wrap gap-4 items-center">
    <label class="flex gap-2 items-center"><input type="checkbox" bind:checked={live.autoPlay} /> autoPlay</label>
    <label class="flex gap-2 items-center"><input type="checkbox" bind:checked={live.loop} /> loop</label>
    <label class="flex gap-2 items-center">effect
      <select bind:value={live.effect} class="py-1"><option>slide</option><option>fade</option><option>zoom</option><option>flip</option><option>cube</option></select>
    </label>
    <label class="flex gap-2 items-center">direction
      <select bind:value={live.direction} class="py-1"><option>horizontal</option><option>vertical</option></select>
    </label>
    <label class="flex gap-2 items-center">perView
      <input type="number" min="1" max="4" bind:value={live.perView} class="w-20 py-1" />
    </label>
  </div>
  <SliderNew {...live} gap={12} class={live.direction === "vertical" ? "h-80" : ""}>
    {#each colors as color, i (color)}
      <SlideNew src={img(color, `Live ${i + 1}`)} alt="Live slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("10. Right to left", "Inside dir=\"rtl\". Next is on the left, the slides move the other way, dragging follows the finger, and Left arrow goes to the next slide.")}
  <div dir="rtl">
    <SliderNew perView={2} gap={12}>
      {#each colors.slice(0, 5) as color, i (color)}
        <SlideNew src={img(color, `RTL ${i + 1}`)} alt="RTL slide {i + 1}" />
      {/each}
    </SliderNew>
  </div>

  {@render section("11. Links, custom icons, no timer, transitionDuration 0", "Each slide is a link (a drag does not follow it). No timer and no pause button. Moves are instant and the slider never freezes.")}
  <SliderNew timer={false} pauseButton={false} transitionDuration={0} ariaLabel="Linked slides">
    {#snippet prevButton()}<span class="text-2xl font-bold">‹</span>{/snippet}
    {#snippet nextButton()}<span class="text-2xl font-bold">›</span>{/snippet}
    {#each colors.slice(0, 3) as color, i (color)}
      <SlideNew href="#slide-link-{i + 1}" src={img(color, `Link ${i + 1}`)} alt="Go to link {i + 1}" />
    {/each}
  </SliderNew>

  <h2 class="text-3xl font-bold mt-10">Step 2: effects</h2>
  <p class="text-gray-600 dark:text-gray-400">Try each effect with the arrows, the dots, auto play and dragging. Dragging moves the effect step by step with your finger. Section 9 above also lets you switch effects live.</p>

  {@render section("13. Zoom", "The new slide grows in from 80% while the old one grows past 100% and fades out.")}
  <SliderNew effect="zoom" transitionDuration={900}>
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Zoom ${i + 1}`)} alt="Zoom slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("14. Flip", "The slide flips like a card, turning side to side. Only one side is visible at a time.")}
  <SliderNew effect="flip" transitionDuration={900}>
    {#each colors.slice(2, 6) as color, i (color)}
      <SlideNew src={img(color, `Flip ${i + 1}`)} alt="Flip slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("15. Flip: vertical and right to left", "With direction=\"vertical\" the slide flips top to bottom. In the right-to-left version it turns the other way.")}
  <SliderNew effect="flip" direction="vertical" class="h-80" transitionDuration={900} autoPlay={false}>
    {#each colors.slice(1, 5) as color, i (color)}
      <SlideNew src={img(color, `Vertical flip ${i + 1}`)} alt="Vertical flip slide {i + 1}" />
    {/each}
  </SliderNew>
  <div dir="rtl">
    <SliderNew effect="flip" transitionDuration={900} autoPlay={false}>
      {#each colors.slice(2, 6) as color, i (color)}
        <SlideNew src={img(color, `RTL flip ${i + 1}`)} alt="RTL flip slide {i + 1}" />
      {/each}
    </SliderNew>
  </div>

  {@render section("16. Cube", "The slides are the sides of a turning cube. The second one is vertical and turns up and down. Resize the window: the cube keeps its shape.")}
  <SliderNew effect="cube" transitionDuration={1000} class="bg-gray-900">
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Cube ${i + 1}`)} alt="Cube slide {i + 1}" />
    {/each}
  </SliderNew>
  <SliderNew effect="cube" direction="vertical" transitionDuration={1000} class="h-80 bg-gray-900" mousewheel>
    {#each colors.slice(2, 6) as color, i (color)}
      <SlideNew src={img(color, `Vertical cube ${i + 1}`)} alt="Vertical cube slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("17. Ken Burns", "Images zoom and pan slowly while shown, each in a different direction. First with fade, then with the slide effect. Pausing or hovering does not stop the zoom.")}
  <SliderNew effect="fade" kenBurns slideDuration={6000} transitionDuration={1200}>
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Ken Burns ${i + 1}`)} alt="Ken Burns slide {i + 1}" />
    {/each}
  </SliderNew>
  <SliderNew kenBurns>
    {#each colors.slice(2, 6) as color, i (color)}
      <SlideNew src={img(color, `Ken Burns slide ${i + 1}`)} alt="Ken Burns slide effect {i + 1}" />
    {/each}
  </SliderNew>

  <h2 class="text-3xl font-bold mt-10">Step 3: parallax</h2>
  <p class="text-gray-600 dark:text-gray-400">Parallax shows best when you drag slowly or set a long transitionDuration.</p>

  {@render section("19. Image parallax", "parallax (0.5): the image moves at half the slide's speed, so it lags behind as the slide moves. No empty strip appears at the edges. The second slider uses parallax={1}: the images stay still and the slide edge wipes across them.")}
  <SliderNew parallax transitionDuration={1200} autoPlay={false}>
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Parallax ${i + 1}`)} alt="Parallax slide {i + 1}" />
    {/each}
  </SliderNew>
  <SliderNew parallax={1} transitionDuration={1200} autoPlay={false}>
    {#each colors.slice(2, 6) as color, i (color)}
      <SlideNew src={img(color, `Parallax 1 - ${i + 1}`)} alt="Full parallax slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("20. Image parallax: vertical, right to left, carousel", "Vertical moves up and down. Right to left lags the other way. In the carousel (perView 3) only the slides at the edges lag; the slides fully in view stay still.")}
  <SliderNew parallax direction="vertical" class="h-80" transitionDuration={1200} autoPlay={false} mousewheel>
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Vertical parallax ${i + 1}`)} alt="Vertical parallax slide {i + 1}" />
    {/each}
  </SliderNew>
  <div dir="rtl">
    <SliderNew parallax transitionDuration={1200} autoPlay={false}>
      {#each colors.slice(1, 5) as color, i (color)}
        <SlideNew src={img(color, `RTL parallax ${i + 1}`)} alt="RTL parallax slide {i + 1}" />
      {/each}
    </SliderNew>
  </div>
  <SliderNew parallax perView={3} gap={12} transitionDuration={1000} autoPlay={false}>
    {#each colors as color, i (color)}
      <SlideNew src={img(color, `Card parallax ${i + 1}`)} alt="Card parallax {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("21. Layer parallax", "The title (data-parallax=\"0.6\"), the text (data-parallax=\"0.3\", data-parallax-opacity=\"0\") and the button (data-parallax-scale=\"0.5\", data-parallax-opacity=\"0\") move at different speeds. The background shape uses data-parallax=\"-0.3\" and moves ahead of the slide.")}
  {#snippet layers(i: number)}
    <div class="absolute size-40 rounded-full bg-white/30 top-6 end-10" data-parallax="-0.3"></div>
    <div class="relative flex flex-col items-start gap-4 p-10 w-full max-w-xl text-black">
      <h3 class="text-4xl font-bold" data-parallax="0.6">Layer slide {i + 1}</h3>
      <p data-parallax="0.3" data-parallax-opacity="0">Each layer moves at its own speed, set with a data attribute on the element.</p>
      <button type="button" class="px-4 py-2 rounded bg-black text-white" data-parallax-scale="0.5" data-parallax-opacity="0">Read more</button>
    </div>
  {/snippet}
  <SliderNew transitionDuration={1200} autoPlay={false}>
    {#each ["bg-yellow-200", "bg-rose-200", "bg-teal-200"] as bg, i (bg)}
      <SlideNew class="{bg} h-80 justify-start">{@render layers(i)}</SlideNew>
    {/each}
  </SliderNew>

  {@render section("22. Layer parallax with other effects", "Layers also work with fade and cube: the layers move while the slide fades or turns.")}
  <SliderNew effect="fade" transitionDuration={1200} autoPlay={false}>
    {#each ["bg-sky-200", "bg-lime-200", "bg-orange-200"] as bg, i (bg)}
      <SlideNew class="{bg} h-80 justify-start">{@render layers(i)}</SlideNew>
    {/each}
  </SliderNew>
  <SliderNew effect="cube" transitionDuration={1200} autoPlay={false} class="bg-gray-900">
    {#each ["bg-violet-200", "bg-emerald-200", "bg-amber-200"] as bg, i (bg)}
      <SlideNew class="{bg} h-80 justify-start">{@render layers(i)}</SlideNew>
    {/each}
  </SliderNew>

  <h2 class="text-3xl font-bold mt-10">Step 4: layout and navigation</h2>

  {@render section("24. Responsive perView and gap", "perView={{ base: 1, sm: 2, lg: 3, xl: 4 }} and gap={{ base: 8, lg: 20 }}. Resize the window: the number of slides and the gap change, and the dots follow.")}
  <SliderNew perView={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={{ base: 8, lg: 20 }} autoPlay={false}>
    {#each colors as color, i (color)}
      <SlideNew src={img(color, `Responsive ${i + 1}`)} alt="Responsive slide {i + 1}" class="rounded-lg" />
    {/each}
  </SliderNew>

  {@render section("25. Peek", "peek={{ base: 24, md: 80 }} with gap 16: the previous and next slides show at the edges. They can't be reached with Tab until they move into view. The second slider is a peeking carousel with perView 2 and loop off: at the start, the space before the first slide stays empty.")}
  <SliderNew peek={{ base: 24, md: 80 }} gap={16} slideDuration={4000}>
    {#each colors.slice(0, 5) as color, i (color)}
      <SlideNew src={img(color, `Peek ${i + 1}`)} alt="Peek slide {i + 1}" class="rounded-xl" />
    {/each}
  </SliderNew>
  <SliderNew peek="3rem" perView={2} gap={12} loop={false} autoPlay={false}>
    {#each colors as color, i (color)}
      <SlideNew src={img(color, `Peek carousel ${i + 1}`)} alt="Peek carousel slide {i + 1}" class="rounded-xl" />
    {/each}
  </SliderNew>

  {@render section("26. Centered", "centered with perView 3: the active slide is in the middle, with one slide on each side. Dot 1 centers slide 1. The second slider is centered with loop off, so the first and last slides also center, leaving an empty slot.")}
  <SliderNew centered perView={3} gap={12} autoPlay={false}>
    {#each colors as color, i (color)}
      <SlideNew src={img(color, `Centered ${i + 1}`)} alt="Centered slide {i + 1}" class="rounded-lg" />
    {/each}
  </SliderNew>
  <SliderNew centered perView={3} gap={12} loop={false} autoPlay={false}>
    {#each colors.slice(0, 5) as color, i (color)}
      <SlideNew src={img(color, `Centered no loop ${i + 1}`)} alt="Centered no loop slide {i + 1}" class="rounded-lg" />
    {/each}
  </SliderNew>

  {@render section("27. Thumbnails", "thumbnails with the dots turned off. The active thumbnail is highlighted and scrolls into the middle of the strip. The last slider has content slides: one sets thumbnail, the others show their number.")}
  <SliderNew thumbnails indicator={false} slideDuration={3000}>
    {#each [...colors, ...colors.slice(0, 4)] as color, i (i)}
      <SlideNew src={img(color, `Thumb ${i + 1}`)} alt="Thumbnail slide {i + 1}" />
    {/each}
  </SliderNew>
  <SliderNew thumbnails indicator={false} autoPlay={false} effect="fade">
    <SlideNew class="bg-yellow-200 h-60 text-black text-3xl font-bold" thumbnail={img("FDE68A", "Intro")}>Intro (custom thumbnail)</SlideNew>
    <SlideNew class="bg-rose-200 h-60 text-black text-3xl font-bold">Content 2</SlideNew>
    <SlideNew class="bg-teal-200 h-60 text-black text-3xl font-bold">Content 3</SlideNew>
  </SliderNew>

  {@render section("28. Timer and fraction", "First: fraction only (timer off). Second: both. Third: neither. The fraction shows \"2 / 5\" at the top end corner.")}
  <SliderNew fraction timer={false} slideDuration={3000}>
    {#each colors.slice(0, 5) as color, i (color)}
      <SlideNew src={img(color, `Fraction ${i + 1}`)} alt="Fraction slide {i + 1}" />
    {/each}
  </SliderNew>
  <SliderNew fraction slideDuration={3000}>
    {#each colors.slice(1, 6) as color, i (color)}
      <SlideNew src={img(color, `Both ${i + 1}`)} alt="Timer and fraction slide {i + 1}" />
    {/each}
  </SliderNew>
  <SliderNew timer={false} slideDuration={3000}>
    {#each colors.slice(0, 3) as color, i (color)}
      <SlideNew src={img(color, `Neither ${i + 1}`)} alt="No timer slide {i + 1}" />
    {/each}
  </SliderNew>

  {@render section("29. Hero with overlay", "A full-height hero: class=\"h-[80vh]\", fade with Ken Burns, and an overlay snippet that stays while the images change. The overlay button is clickable, and dragging on the overlay text still swipes the slides.")}
  <SliderNew class="h-[80vh]" effect="fade" kenBurns controls={false} slideDuration={6000} transitionDuration={1500} ariaLabel="Hero images">
    {#snippet overlay()}
      <div class="size-full flex flex-col items-center justify-center gap-4 bg-black/30 text-white text-center px-6">
        <h3 class="text-5xl font-bold">Build faster with theui</h3>
        <p class="text-lg max-w-xl">This text stays in place while the images change behind it.</p>
        <button type="button" class="px-5 py-2 rounded-md bg-white text-black" onclick={() => alert("Overlay button clicked")}>Get started</button>
      </div>
    {/snippet}
    {#each colors.slice(0, 4) as color, i (color)}
      <SlideNew src={img(color, `Hero ${i + 1}`)} alt="" />
    {/each}
  </SliderNew>

  {@render section("30. Page background", "Turns the whole page background into a slider: class=\"fixed inset-0 -z-10 h-auto\" with no arrows or dots, swipe off, and and its own pause button hidden. The page content covers it, so the page shows a separate pause button next to this toggle with bind:paused. Scroll the page: the background stays.")}
  <div>
    <button type="button" class="px-4 py-2 rounded bg-gray-200 text-black" onclick={() => pageBackground = !pageBackground}>
      {pageBackground ? "Remove" : "Show"} page background
    </button>
    {#if pageBackground}
      <button type="button" class="px-4 py-2 rounded bg-gray-200 text-black" onclick={() => backgroundPaused = !backgroundPaused}>
        {backgroundPaused ? "Play" : "Pause"} background
      </button>
    {/if}
  </div>
  {#if pageBackground}
    <SliderNew
      class="fixed inset-0 -z-10 h-auto opacity-40"
      effect="fade"
      kenBurns
      controls={false}
      indicator={false}
      timer={false}
      swipe={false}
      stopOnHover={false}
      slideDuration={7000}
      transitionDuration={2000}
      pauseButton={false}
      bind:paused={backgroundPaused}
      ariaLabel="Page background"
    >
      {#each colors.slice(0, 4) as color, i (color)}
        <SlideNew src={img(color, `Background ${i + 1}`)} alt="" />
      {/each}
    </SliderNew>
  {/if}

  {@render section("31. Reduced motion", "Turn on \"reduce motion\" in your OS (or emulate prefers-reduced-motion in DevTools). Every slider switches instantly and auto play, the timer, the pause button and the Ken Burns zoom go away.")}
</main>
