import { Directive, ElementRef, inject, input } from '@angular/core'
import { debounceTime, fromEvent, switchMap } from 'rxjs'
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop'

@Directive({
  standalone: true,
  selector: 'input[debouncedInput]',
})
export class DebouncedInput {
  #ref = inject(ElementRef).nativeElement as HTMLInputElement

  readonly debounce = input<number>(500)
  readonly debounce$ = toObservable(this.debounce)

  readonly changeEvent = outputFromObservable(
    this.debounce$.pipe(
      switchMap((debounce: number) => {
        return fromEvent(this.#ref, 'change').pipe(debounceTime(debounce))
      }),
    ),
  )
}
