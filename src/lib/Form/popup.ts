import { autoUpdate, computePosition, flip, offset, shift, size, type Placement } from "@floating-ui/dom"

/**
 * Keeps a panel (a listbox or a calendar) next to the field that opens it.
 * Uses the fixed strategy so a field inside a scrolling box is not clipped,
 * and gives the panel at least the width of the field.
 *
 * @param anchor - The field the panel belongs to.
 * @param panel - The floating element.
 * @param placement - Preferred side, defaults to `"bottom-start"`.
 * @param gap - Space between the field and the panel in pixels.
 * @returns A cleanup function that stops the position updates.
 */
export const attachPanel = (
  anchor: HTMLElement,
  panel: HTMLElement,
  placement: Placement = "bottom-start",
  gap = 4
): (() => void) => {
  panel.style.position = "fixed"
  panel.style.insetInlineStart = "0"
  panel.style.top = "0"

  return autoUpdate(anchor, panel, async () => {
    const { x, y } = await computePosition(anchor, panel, {
      placement,
      strategy: "fixed",
      middleware: [
        offset(gap),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply({ rects, availableHeight, elements }) {
            elements.floating.style.minWidth = `${rects.reference.width}px`
            elements.floating.style.maxHeight = `${Math.max(140, availableHeight - 8)}px`
          },
        }),
      ],
    })
    panel.style.transform = `translate(${x}px, ${y}px)`
    panel.style.insetInlineStart = "0"
    panel.style.left = "0"
    panel.style.top = "0"
  })
}

/**
 * Classes shared by the panels of Combobox, DatePicker and TimePicker:
 * a raised surface with a large radius, the way a menu looks in Material Design.
 */
export const panelClasses = (): string =>
  "theui-field-panel z-50 overflow-auto overscroll-contain rounded-2xl border border-gray-200/80 bg-primary p-2 shadow-xl shadow-black/10 dark:border-gray-700/80 dark:shadow-black/40"

/** Classes for one option inside a panel listbox. */
export const optionClasses = (selected: boolean, activeOption: boolean, disabled: boolean): string =>
  `theui-field-option flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors ${
    disabled ? "cursor-not-allowed opacity-50" : activeOption ? "bg-secondary" : ""
  } ${selected ? "bg-brand-500/15 font-medium text-brand-600 dark:text-brand-300" : ""}`

/** A quiet, pill shaped button: the calendar arrows, the month button and the footer actions. */
export const panelButtonClasses = (): string =>
  "theui-field-panel-button flex items-center justify-center rounded-full transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
