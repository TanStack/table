import { DestroyRef, Directive, ElementRef, inject } from '@angular/core'
import { TradingBenchmarkController } from '../../benchmark/trading-benchmark.controller'

@Directive({
  selector: 'tbody[appTradingTableBenchmark]',
})
export class TradingTableBenchmarkDirective {
  readonly #controller = inject(TradingBenchmarkController)
  readonly #element = inject<ElementRef<HTMLTableSectionElement>>(ElementRef)
  readonly #observer = new MutationObserver((records) => {
    this.#controller.recordDomMutations(records.length)
  })

  constructor() {
    this.#controller.resetDomMutations()
    this.#observer.observe(this.#element.nativeElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      characterData: true,
      childList: true,
      subtree: true,
    })
    inject(DestroyRef).onDestroy(() => this.#observer.disconnect())
  }
}
