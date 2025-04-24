import { generateToken } from "$lib/function";
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
  id: string = generateToken();
  isTransitioning: boolean = false; // To track if a transition is in progress

  SLIDERS: Record<string, {
    slides: HTMLElement[],
    activeSlide: HTMLElement | null,
    previousSlide: string | null,
    nextSlide: string | null
  }> = {};

  private indicatorClasses: string =
    "w-8 h-4 bg-white bg-clip-padding flex border-y-[7px] border-transparent opacity-50 rounded-sm transition duration-1000 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded-sm";
  private remainingTime: number = 0;
  private isHovered: boolean = false;
  private pendingTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(config: Partial<SliderConfig>) {
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
    this.SLIDERS[this.id] = {
      slides: [],
      activeSlide: null,
      previousSlide: null,
      nextSlide: null
    }
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
    this.SLIDERS[this.id].slides = [lastClone, ...(slides as HTMLElement[]), firstClone];
  }

  // Update the changeSlide function to ensure indicator stays in sync
  changeSlide(updateType: "next" | "prev") {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const newIndex = this.calculateNextSlideIndex(updateType);
    const indicatorIndex = this.calculateNextIndicatorIndex(newIndex);
    this.updateActiveIndicator(indicatorIndex);
    this.SLIDERS[this.id].activeSlide = this.SLIDERS[this.id].slides[newIndex];
    this.slideTransition();

    if (this.config.autoPlay && !this.isHovered) {
      this.startTimerAnimation();
    }
  }

  slideTransition() {
    const track = document.getElementById(`${this.id}-items`);
    const slides = this.SLIDERS[this.id].slides;
    const totalSlides = slides.length;
    const slideIndex = slides.indexOf(this.SLIDERS[this.id].activeSlide as HTMLElement);

    if (track) {
      const translateValue = -slideIndex * track.clientWidth;
      track.style.transform = `translateX(${translateValue}px)`;
      track.style.transition = `transform ${this.config.transitionDuration}ms ease`;

      this.addTransitionListener(track, () => {
        if (slideIndex === 0) {
          this.SLIDERS[this.id].activeSlide = slides[totalSlides - 2];
          this.updateTrackPosition();
        } else if (slideIndex === totalSlides - 1) {
          this.SLIDERS[this.id].activeSlide = slides[1];
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
    const totalSlides = this.SLIDERS[this.id].slides.length;
    const currentSlideIndex = this.SLIDERS[this.id].slides.indexOf(
      this.SLIDERS[this.id].activeSlide as HTMLElement
    );
    return updateType === "next"
      ? (currentSlideIndex + 1) % totalSlides
      : (currentSlideIndex - 1 + totalSlides) % totalSlides;
  }

  calculateNextIndicatorIndex(newIndex: number) {
    const totalSlides = this.SLIDERS[this.id].slides.length - 2;
    return newIndex === 0
      ? totalSlides - 1
      : newIndex === this.SLIDERS[this.id].slides.length - 1
        ? 0
        : newIndex - 1;
  }

  updateTrackPosition() {
    const track = document.getElementById(`${this.id}-items`);
    const slides = this.SLIDERS[this.id].slides;
    const slideIndex = slides.indexOf(this.SLIDERS[this.id].activeSlide as HTMLElement);
    if (track) {
      const translateValue = -slideIndex * track.clientWidth;
      track.style.transform = `translateX(${translateValue}px)`;
      track.style.transition = "none";
    }
  }

  handleMouseEnter() {
    if (this.config.stopOnHover && this.config.autoPlay) {
      // Clear any pending timeout first
      if (this.pendingTimeout) {
        clearTimeout(this.pendingTimeout);
        this.pendingTimeout = null;
      }

      this.isHovered = true;
      this.stopAutoPlay();
      this.stopTimerAnimation();

      // Calculate remaining time based on current progress
      const timerElement = document.getElementById(`${this.id}-timer`);
      if (timerElement) {
        const computedWidth = parseFloat(window.getComputedStyle(timerElement).width);
        const containerWidth = parseFloat(window.getComputedStyle(timerElement.parentElement!).width);
        this.remainingTime = this.config.slideDuration - (computedWidth / containerWidth * this.config.slideDuration);
      }
    }
  }

  handleMouseLeave() {
    if (this.config.stopOnHover && this.config.autoPlay) {
      this.isHovered = false;
      this.startAutoPlayWithRemainingTime();
      this.startTimerAnimationWithRemainingTime();
    }
  }

  private startAutoPlayWithRemainingTime() {
    this.stopAutoPlay();

    // Clear any existing timeout first
    if (this.pendingTimeout) {
      clearTimeout(this.pendingTimeout);
    }

    // Store the new timeout reference
    this.pendingTimeout = setTimeout(() => {
      if (!this.isHovered) {
        this.changeSlide("next");
        this.startAutoPlay(); // Resume normal intervals
      }
      this.pendingTimeout = null;
    }, this.remainingTime);
  }

  private startTimerAnimationWithRemainingTime() {
    const timerElement = document.getElementById(`${this.id}-timer`);
    if (!timerElement) return;

    // Calculate the starting width based on remaining time
    const progress = 1 - (this.remainingTime / this.config.slideDuration);
    const startingWidth = `${progress * 100}%`;

    timerElement.style.transition = "none";
    timerElement.style.width = startingWidth;

    void timerElement.offsetWidth; // Force reflow

    timerElement.style.transition = `width ${this.remainingTime}ms linear`;
    timerElement.style.width = "100%";

    // Reset remaining time for next cycle
    this.remainingTime = 0;
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
    this.SLIDERS[this.id].activeSlide = this.SLIDERS[this.id].slides[index + 1];
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

  destroy() {
    this.stopAutoPlay();
    this.stopTimerAnimation();
    if (this.pendingTimeout) {
      clearTimeout(this.pendingTimeout);
    }
  }
}