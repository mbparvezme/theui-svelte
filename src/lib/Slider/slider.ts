import { generateToken } from "$lib/function";
import { ST_SLIDER } from "$lib/state.svelte";
import { twMerge } from "tailwind-merge";

export interface SliderConfig {
  autoPlay: boolean;
  stopOnHover: boolean;
  slideDuration: number;
  transitionDuration: number;
  activeSlide: number;
  indicatorClasses: string;
  indicatorActiveClasses: string;
}

export class Slider {
  config: SliderConfig;
  autoPlayInterval!: ReturnType<typeof setInterval>;
  id: string;
  isTransitioning: boolean = false; // To track if a transition is in progress

  private indicatorClasses: string =
    "w-8 h-4 bg-white bg-clip-padding flex border-y-[7px] border-transparent opacity-50 rounded-sm transition duration-1000 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none";

  constructor(config: Partial<SliderConfig>) {
    this.id = generateToken();
    const defaultConfig: SliderConfig = {
      autoPlay: true,
      stopOnHover: true,
      slideDuration: 5000,
      transitionDuration: 300,
      activeSlide: 1,
      indicatorClasses: "",
      indicatorActiveClasses: "",
    };
    this.config = { ...defaultConfig, ...config };
  }

  cloneSlides() {
    const itemsContainer = document.getElementById(`${this.id}-items`);
    if (!itemsContainer) return;

    const slides = Array.from(itemsContainer.children);
    if (!slides.length || itemsContainer.querySelector("[data-clone]")) return;

    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];
    const firstClone = firstSlide.cloneNode(true) as HTMLElement;
    const lastClone = lastSlide.cloneNode(true) as HTMLElement;

    firstClone.setAttribute("data-clone", "true");
    lastClone.setAttribute("data-clone", "true");

    itemsContainer.appendChild(firstClone);
    itemsContainer.insertBefore(lastClone, firstSlide);

    ST_SLIDER[this.id as string].slides = [lastClone, ...(slides as HTMLElement[]), firstClone];
  }

  changeSlide(updateType: "next" | "prev") {
    if (this.isTransitioning) return; // Prevent multiple transitions
    this.isTransitioning = true;

    const newIndex = this.calculateNextSlideIndex(updateType);
    this.updateActiveIndicator(this.calculateNextIndicatorIndex(newIndex));
    ST_SLIDER[this.id].activeSlide = ST_SLIDER[this.id].slides[newIndex];
    this.slideTransition();

    if (this.config.autoPlay) {
      this.startTimerAnimation();
    }
  }

  slideTransition() {
    const track = document.getElementById(`${this.id}-items`);
    const slides = ST_SLIDER[this.id].slides;
    const totalSlides = slides.length;
    const slideIndex = slides.indexOf(ST_SLIDER[this.id].activeSlide as HTMLElement);

    if (track) {
      const translateValue = -slideIndex * track.clientWidth;
      track.style.transform = `translateX(${translateValue}px)`;
      track.style.transition = `transform ${this.config.transitionDuration}ms ease`;

      this.addTransitionListener(track, () => {
        if (slideIndex === 0) {
          ST_SLIDER[this.id].activeSlide = slides[totalSlides - 2];
          this.updateTrackPosition();
        } else if (slideIndex === totalSlides - 1) {
          ST_SLIDER[this.id].activeSlide = slides[1];
          this.updateTrackPosition();
        }
        this.isTransitioning = false; // Reset transitioning flag
      });
    }
  }

  addTransitionListener(track: HTMLElement, callback: () => void) {
    const handler = () => {
      callback();
      track.removeEventListener("transitionend", handler);
    };
    track.addEventListener("transitionend", handler);
  }

  calculateNextSlideIndex(updateType: "next" | "prev") {
    const totalSlides = ST_SLIDER[this.id].slides.length;
    const currentSlideIndex = ST_SLIDER[this.id].slides.indexOf(
      ST_SLIDER[this.id].activeSlide as HTMLElement
    );
    return updateType === "next"
      ? (currentSlideIndex + 1) % totalSlides
      : (currentSlideIndex - 1 + totalSlides) % totalSlides;
  }

  calculateNextIndicatorIndex(newIndex: number) {
    const totalSlides = ST_SLIDER[this.id].slides.length - 2;
    return newIndex === 0
      ? totalSlides - 1
      : newIndex === ST_SLIDER[this.id].slides.length - 1
        ? 0
        : newIndex - 1;
  }

  updateTrackPosition() {
    const track = document.getElementById(`${this.id}-items`);
    const slides = ST_SLIDER[this.id].slides;
    const slideIndex = slides.indexOf(ST_SLIDER[this.id].activeSlide as HTMLElement);
    if (track) {
      const translateValue = -slideIndex * track.clientWidth;
      track.style.transform = `translateX(${translateValue}px)`;
      track.style.transition = "none";
    }
  }

  handleMouseEnter() {
    if (this.config.stopOnHover && this.config.autoPlay) {
      this.stopAutoPlay();
      this.stopTimerAnimation();
    }
  }

  handleMouseLeave() {
    if (this.config.stopOnHover && this.config.autoPlay) {
      this.startAutoPlay();
      this.startTimerAnimation();
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(
      () => this.changeSlide("next"),
      this.config.slideDuration
    );
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }

  createIndicator() {
    const itemsContainer = document.getElementById(`${this.id}-items`);
    if (itemsContainer) {
      const slides = Array.from(itemsContainer.children);
      if (slides.length) {
        const indicatorContainer = document.getElementById(
          `${this.id}-indicators`
        );
        if (indicatorContainer) {
          for (let i = 0; i < slides.length; i++) {
            const button = document.createElement("button");
            button.className = `slide-indicator ${twMerge(
              this.indicatorClasses,
              this.config.indicatorClasses
            )}`;
            button.type = "button";
            button.setAttribute("aria-label", `Go to slide ${i + 1}`);
            button.addEventListener("click", () =>
              this.changeSlideByIndicator(i)
            );
            indicatorContainer.appendChild(button);
          }
        }
      }
    }
  }

  changeSlideByIndicator(index: number) {
    if (this.isTransitioning) return; // Prevent multiple transitions
    this.updateActiveIndicator(index);
    ST_SLIDER[this.id].activeSlide = ST_SLIDER[this.id].slides[index + 1];
    this.slideTransition();
  }

  updateActiveIndicator(index: number) {
    const indicatorContainer = document.getElementById(`${this.id}-indicators`);
    if (!indicatorContainer) return;

    const buttons = indicatorContainer.querySelectorAll<HTMLButtonElement>(
      ".slide-indicator"
    );

    buttons.forEach((button, i) => {
      button.className = `slide-indicator ${twMerge(
        this.indicatorClasses,
        this.config.indicatorClasses,
        i === index
          ? twMerge("opacity-100", this.config.indicatorActiveClasses)
          : "opacity-50"
      )}`;
    });
  }

  startTimerAnimation() {
    const timerElement = document.getElementById(`${this.id}-timer`);
    if (!timerElement) return;

    timerElement.style.transition = "none";
    timerElement.style.width = "0";

    void timerElement.offsetWidth;

    timerElement.style.transition = `width ${this.config.slideDuration}ms linear`;
    timerElement.style.width = "100%";
  }

  stopTimerAnimation() {
    const timerElement = document.getElementById(`${this.id}-timer`);
    if (timerElement) {
      timerElement.style.width = window.getComputedStyle(timerElement).width;
      timerElement.style.transition = "none";
    }
  }

  getButtonClasses(classes: string, type: "prev" | "next") {
    return twMerge(
      `absolute flex justify-center items-center top-1/2 transform -translate-y-1/2 bg-gray-200 dark:text-black opacity-60 p-2 w-12 h-12 rounded-full transition-opacity duration-300 hover:opacity-100 ${type === "next" ? "right-4" : "left-4"
      }`,
      classes
    );
  }

  getIndicatorContainerClasses(classes: string) {
    return twMerge("bottom-0 inset-x-0 flex justify-center gap-2 mb-4", classes);
  }
}

export const getSlideClasses = (slideClasses: string, classes: string) => {
  return twMerge(
    "relative flex-shrink-0 w-full min-h-48 flex items-center justify-center",
    slideClasses,
    classes
  );
};