import { Directive, HostListener, input, output } from '@angular/core'
import { injectDebouncer } from '@tanstack/angular-pacer'

@Directive({
  standalone: true,
  selector: 'input[debouncedInput]',
})
export class DebouncedInput {
  readonly debounce = input<number>(500)
  readonly changeEvent = output<Event>()

  readonly #emitChange = injectDebouncer(
    (event: Event) => this.changeEvent.emit(event),
    () => ({ wait: this.debounce() }),
  )

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    this.#emitChange.maybeExecute(event)
  }
}
