import { useStoreValue } from '../use-store-value'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const ms = (value: number): string => `${value.toFixed(2)} ms`

export function MetricsStrip({ controller }: { controller: TradingBenchmarkController }) @{
  const state = useStoreValue(controller.store)
  const metrics = state.metrics
  const items = [
    ['WORKER SAMPLES', rate.format(metrics.actualTicksPerSecond), 'generated samples/s', 'actual-rate'],
    ['ROW UPDATES', rate.format(metrics.rowUpdatesPerSecond), 'unique rows applied/s', 'row-update-rate'],
    ['MESSAGES', metrics.workerMessagesPerSecond.toFixed(1), 'worker messages/s', 'message-rate'],
    ['STATE APPLIES', metrics.stateApplicationsPerSecond.toFixed(1), 'quote snapshots/s', 'state-apply-rate'],
    ['TABLE COMMITS', metrics.tableRendersPerSecond.toFixed(1), 'completed renders/s', 'table-render-rate'],
    ['AVG RENDER', ms(metrics.averageRenderMs), 'mutation → render', ''],
    ['P95 RENDER', ms(metrics.p95RenderMs), `max ${ms(metrics.maxRenderMs)}`, ''],
    ['LONG FRAMES', state.longAnimationFramesSupported ? String(metrics.longAnimationFrames) : 'N/A', state.longAnimationFramesSupported ? `worst ${ms(metrics.worstLongAnimationFrameMs)}` : 'unsupported', 'long-frame-count'],
  ] as const
  <section className="metrics-strip" aria-label="Live performance metrics">
    @for (const item of items; key item[0]) {
      <article><span>{item[0]}</span><strong data-testid={item[3] || undefined}>{item[1]}</strong><small>{item[2]}</small></article>
    }
  </section>
}
