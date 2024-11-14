import { Directive, ElementRef, inject, input } from '@angular/core'
import { Observable, debounceTime, fromEvent, switchMap } from 'rxjs'
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop'
import type { MonoTypeOperatorFunction } from 'rxjs'
import type { NgZone } from '@angular/core'

export function runOutsideAngular<T>(
  zone: NgZone,
): MonoTypeOperatorFunction<T> {
  return (source) =>
    new Observable((subscriber) =>
      zone.runOutsideAngular(() => source.subscribe(subscriber)),
    )
}

@Directive({
  standalone: true,
  selector: 'input[debouncedInput]',
})
export class DebouncedInputDirective {
  #ref = inject(ElementRef).nativeElement as HTMLInputElement

  readonly debounce = input<number>(500)
  readonly debounce$ = toObservable(this.debounce)

  readonly changeEvent = outputFromObservable(
    this.debounce$.pipe(
      switchMap((debounce) => {
        return fromEvent(this.#ref, 'change').pipe(debounceTime(debounce))
      }),
    ),
  )
}
