import { Directive, HostListener, input, output } from '@angular/core'

@Directive({
  standalone: true,
  selector: 'input[debouncedInput]',
})
export class DebouncedInput {
  readonly debounce = input<number>(300)
  readonly changeEvent = output<Event>()

  private timeout: ReturnType<typeof setTimeout> | undefined

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.changeEvent.emit(event)
    }, this.debounce())
  }
}
