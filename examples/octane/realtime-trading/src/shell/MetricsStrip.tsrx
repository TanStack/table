import { useSelector } from '@tanstack/octane-store'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const ms = (value: number): string => `${value.toFixed(2)} ms`

export function MetricsStrip({ controller }: { controller: TradingBenchmarkController }) @{
  const state = useSelector(controller.store)
  const metrics = state.metrics
  const items = [
    ['FRAME RATE (EST.)', metrics.rafCallbacksPerSecond.toFixed(1), 'rAF callbacks/s · rolling 1 s', 'frame-rate'],
    ['AVG COMMIT', ms(metrics.averageRenderMs), 'snapshot → DOM · rolling 3 s', 'average-commit-latency'],
    ['LONG FRAMES', state.longAnimationFramesSupported ? String(metrics.longAnimationFrames) : 'N/A', state.longAnimationFramesSupported ? `since reset · worst ${ms(metrics.worstLongAnimationFrameMs)}` : 'unsupported', 'long-frame-count'],
    ['THROUGHPUT', `${rate.format(metrics.rowUpdatesPerSecond)} rows/s`, `${metrics.stateApplicationsPerSecond.toFixed(1)} snapshots/s · rows deduplicated per snapshot`, 'throughput-rate'],
  ] as const
  <section className="metrics-strip" aria-labelledby="live-health">
    <h2 id="live-health">LIVE HEALTH</h2>
    @for (const item of items; key item[0]) {
      <article><span>{item[0]}</span><strong data-testid={item[3] || undefined}>{item[1]}</strong><small>{item[2]}</small></article>
    }
  </section>
}
