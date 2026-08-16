import { defineComponent, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'

export const quoteCellLifecycle = {
  created: 0,
  destroyed: 0,
}

export const quoteCellRendererNames = [
  'Market',
  'Name',
  'Symbol',
  'Last',
  'Change',
  'ChangePercent',
  'Bid',
  'BidVolume',
  'Ask',
  'AskVolume',
  'Open',
  'High',
  'Low',
  'Intraday',
] as const

export const quoteComponentNames = [
  'PriceCell',
  'StableMoveCell',
  'UpMoveCell',
  'DownMoveCell',
  'PercentChangeCell',
  'SparklineCell',
] as const

export type QuoteCellRendererName = (typeof quoteCellRendererNames)[number]
export type QuoteComponentName = (typeof quoteComponentNames)[number]

const createCounterMap = <Name extends string>(
  names: ReadonlyArray<Name>,
): Record<Name, number> =>
  Object.fromEntries(names.map((name) => [name, 0])) as Record<Name, number>

export const quoteRenderDiagnostics = {
  cellRendererCalls: 0,
  componentRenderCalls: 0,
  cellRendererCallsByName: createCounterMap(quoteCellRendererNames),
  componentRenderCallsByName: createCounterMap(quoteComponentNames),
}

export function recordCellRender<T>(name: QuoteCellRendererName, value: T): T {
  quoteRenderDiagnostics.cellRendererCalls++
  quoteRenderDiagnostics.cellRendererCallsByName[name]++
  return value
}

function useLifecycleCounter(componentName: QuoteComponentName): () => void {
  onMounted(() => {
    quoteCellLifecycle.created++
  })
  onUnmounted(() => {
    quoteCellLifecycle.destroyed++
  })
  return () => {
    quoteRenderDiagnostics.componentRenderCalls++
    quoteRenderDiagnostics.componentRenderCallsByName[componentName]++
  }
}

export const PriceCell = defineComponent({
  name: 'PriceCell',
  props: {
    price: { type: Number, required: true },
    move: { type: Number, required: true },
    onSelect: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const recordRender = useLifecycleCounter('PriceCell')
    return () => {
      recordRender()
      return (
        <button
          class={[
            'price-button',
            props.move >= 0 ? 'quote-up' : 'quote-down',
          ]}
          onClick={props.onSelect}
        >
          {props.price.toFixed(2)}
        </button>
      )
    }
  },
})

function createMoveCell(
  name: 'StableMoveCell' | 'UpMoveCell' | 'DownMoveCell',
  fixedDirection?: 'up' | 'down',
) {
  return defineComponent({
    name,
    props: { move: { type: Number, required: true } },
    setup(props) {
      const recordRender = useLifecycleCounter(name)
      return () => {
        recordRender()
        const direction = fixedDirection ?? (props.move >= 0 ? 'up' : 'down')
        const indicator =
          fixedDirection === 'up' ? '▲ ' : fixedDirection === 'down' ? '▼ ' : ''
        return (
          <span class={['move-cell', `quote-${direction}`]}>
            {indicator}
            {formatSigned(props.move)}
          </span>
        )
      }
    },
  })
}

export const StableMoveCell = createMoveCell('StableMoveCell')
export const UpMoveCell = createMoveCell('UpMoveCell', 'up')
export const DownMoveCell = createMoveCell('DownMoveCell', 'down')

export const PercentChangeCell = defineComponent({
  name: 'PercentChangeCell',
  props: { value: { type: Number, required: true } },
  setup(props) {
    const recordRender = useLifecycleCounter('PercentChangeCell')
    return () => {
      recordRender()
      return (
        <span
          class={[
            'percent-change-cell',
            props.value >= 0 ? 'quote-up' : 'quote-down',
          ]}
        >
          {props.value >= 0 ? '+' : ''}
          {props.value.toFixed(2)}%
        </span>
      )
    }
  },
})

export const SparklineCell = defineComponent({
  name: 'SparklineCell',
  props: {
    values: {
      type: Array as PropType<ReadonlyArray<number>>,
      required: true,
    },
  },
  setup(props) {
    const recordRender = useLifecycleCounter('SparklineCell')
    return () => {
      recordRender()
      const rising =
        (props.values.at(-1) ?? 0) >= (props.values[0] ?? 0)
      const { min, max } = findRange(props.values)
      const range = max - min || 1
      const denominator = Math.max(1, props.values.length - 1)
      const points = props.values
        .map((value, index) => {
          const x = (index / denominator) * 100
          const y = 22 - ((value - min) / range) * 20
          return `${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(' ')
      return (
        <svg
          class={['sparkline', rising ? 'quote-up' : 'quote-down']}
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
        >
          <polyline points={points} />
        </svg>
      )
    }
  },
})

function formatSigned(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}

function findRange(values: ReadonlyArray<number>): {
  min: number
  max: number
} {
  const first = values[0] ?? 0
  return values.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: first, max: first },
  )
}
