import { Directive, HostListener, input, output } from '@angular/core'
import { injectDebouncedCallback } from '@tanstack/angular-pacer'

@Directive({
  standalone: true,
  selector: 'input[debouncedInput]',
})
export class DebouncedInput {
  readonly debounce = input<number>(500)
  readonly changeEvent = output<Event>()

  readonly #emitChange = injectDebouncedCallback(
    (event: Event) => this.changeEvent.emit(event),
    { wait: () => this.debounce() },
  )

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    this.#emitChange(event)
  }
}
