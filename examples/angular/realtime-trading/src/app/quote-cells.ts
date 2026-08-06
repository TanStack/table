import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core'
import type { OnDestroy } from '@angular/core'

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const quoteCellLifecycle = {
  created: 0,
  destroyed: 0,
}

function trackCreation(): void {
  quoteCellLifecycle.created++
}

function trackDestruction(): void {
  quoteCellLifecycle.destroyed++
}

@Component({
  selector: 'app-price-cell',
  template: `
    <button
      class="price-button"
      [class.quote-up]="move() >= 0"
      [class.quote-down]="move() < 0"
      (click)="select.emit()"
    >
      {{ formattedPrice() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceCell implements OnDestroy {
  readonly price = input.required<number>()
  readonly move = input.required<number>()
  readonly select = output<void>()
  readonly formattedPrice = computed(() => this.price().toFixed(2))

  constructor() {
    trackCreation()
  }

  ngOnDestroy(): void {
    trackDestruction()
  }
}

@Component({
  selector: 'app-stable-move-cell',
  template: `
    <span
      class="move-cell"
      [class.quote-up]="move() >= 0"
      [class.quote-down]="move() < 0"
    >
      {{ formattedMove() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StableMoveCell implements OnDestroy {
  readonly move = input.required<number>()
  readonly formattedMove = computed(() => formatSigned(this.move()))

  constructor() {
    trackCreation()
  }

  ngOnDestroy(): void {
    trackDestruction()
  }
}

@Component({
  selector: 'app-spread-cell',
  template: `
    <span class="spread-cell" [class.spread-wide]="basisPoints() >= 4">
      {{ formattedSpread() }}
      <small>{{ basisPoints().toFixed(1) }} bp</small>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpreadCell implements OnDestroy {
  readonly bid = input.required<number>()
  readonly ask = input.required<number>()
  readonly spread = computed(() => Math.max(0, this.ask() - this.bid()))
  readonly basisPoints = computed(() => {
    const midpoint = (this.bid() + this.ask()) / 2
    return midpoint === 0 ? 0 : (this.spread() / midpoint) * 10_000
  })
  readonly formattedSpread = computed(() => this.spread().toFixed(2))

  constructor() {
    trackCreation()
  }

  ngOnDestroy(): void {
    trackDestruction()
  }
}

@Component({
  selector: 'app-depth-cell',
  template: `
    <div
      class="depth-cell"
      [attr.title]="'Bid ' + bidSize() + ' / Ask ' + askSize()"
    >
      <span class="depth-bid" [style.width.%]="bidShare()"></span>
      <span class="depth-ask" [style.width.%]="100 - bidShare()"></span>
      <span class="depth-values">
        <span>{{ formattedBidSize() }}</span>
        <span>{{ formattedAskSize() }}</span>
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthCell implements OnDestroy {
  readonly bidSize = input.required<number>()
  readonly askSize = input.required<number>()
  readonly bidShare = computed(() => {
    const total = this.bidSize() + this.askSize()
    return total === 0 ? 50 : (this.bidSize() / total) * 100
  })
  readonly formattedBidSize = computed(() =>
    compactNumber.format(this.bidSize()),
  )
  readonly formattedAskSize = computed(() =>
    compactNumber.format(this.askSize()),
  )

  constructor() {
    trackCreation()
  }

  ngOnDestroy(): void {
    trackDestruction()
  }
}

@Component({
  selector: 'app-quote-age-cell',
  template: `
    <span
      class="quote-age"
      [class.quote-age-warm]="ageMs() >= 500"
      [class.quote-age-stale]="ageMs() >= 1_500"
    >
      {{ formattedAge() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteAgeCell implements OnDestroy {
  readonly ageMs = input.required<number>()
  readonly formattedAge = computed(() => {
    const age = this.ageMs()
    return age < 1_000
      ? `${Math.round(age)} ms`
      : `${(age / 1_000).toFixed(1)} s`
  })

  constructor() {
    trackCreation()
  }

  ngOnDestroy(): void {
    trackDestruction()
  }
}

@Component({
  selector: 'app-up-move-cell',
  template: `<span class="move-cell quote-up">▲ {{ formattedMove() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpMoveCell implements OnDestroy {
  readonly move = input.required<number>()
  readonly formattedMove = computed(() => formatSigned(this.move()))

  constructor() {
    trackCreation()
  }

  ngOnDestroy(): void {
    trackDestruction()
  }
}

@Component({
  selector: 'app-down-move-cell',
  template: `<span class="move-cell quote-down">▼ {{ formattedMove() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownMoveCell implements OnDestroy {
  readonly move = input.required<number>()
  readonly formattedMove = computed(() => formatSigned(this.move()))

  constructor() {
    trackCreation()
  }

  ngOnDestroy(): void {
    trackDestruction()
  }
}

@Component({
  selector: 'app-sparkline-cell',
  template: `
    <svg class="sparkline" viewBox="0 0 100 24" preserveAspectRatio="none">
      <polyline [attr.points]="points()" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparklineCell implements OnDestroy {
  readonly values = input.required<ReadonlyArray<number>>()
  readonly points = computed(() => {
    const values = this.values()
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const denominator = Math.max(1, values.length - 1)

    return values
      .map((value, index) => {
        const x = (index / denominator) * 100
        const y = 22 - ((value - min) / range) * 20
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  })

  constructor() {
    trackCreation()
  }

  ngOnDestroy(): void {
    trackDestruction()
  }
}

function formatSigned(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}`
}
