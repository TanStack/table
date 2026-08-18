import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'
import { formatInteger, formatRate } from './shell-formatters'

@Component({
  selector: 'app-diagnostics',
  template: `
    <section class="config-section diagnostics" aria-labelledby="diagnostics">
      <h2 id="diagnostics">DIAGNOSTICS</h2>
      <dl>
        <div>
          <dt>Rendered rows / source</dt>
          <dd data-testid="rendered-row-count">
            {{ formatInteger(controller.renderedRowCount()) }} /
            {{ formatInteger(controller.displayQuotes().length) }}
          </dd>
        </div>
        <div>
          <dt>Mounted cell hosts</dt>
          <dd>{{ formatInteger(controller.mountedCells()) }}</dd>
        </div>
        <div>
          <dt>Live components</dt>
          <dd>{{ formatInteger(controller.liveComponents()) }}</dd>
        </div>
        <div>
          <dt>Created / destroyed</dt>
          <dd>
            {{ formatInteger(controller.metrics().componentsCreated) }} /
            {{ formatInteger(controller.metrics().componentsDestroyed) }}
          </dd>
        </div>
        <div>
          <dt>Worker samples / s</dt>
          <dd data-testid="actual-rate">
            {{ formatRate(controller.metrics().actualTicksPerSecond) }}
          </dd>
        </div>
        <div>
          <dt>Worker messages / s</dt>
          <dd data-testid="message-rate">
            {{ controller.metrics().workerMessagesPerSecond.toFixed(1) }}
          </dd>
        </div>
        <div>
          <dt>Changed rows / s</dt>
          <dd data-testid="row-update-rate">
            {{ formatRate(controller.metrics().rowUpdatesPerSecond) }}
          </dd>
        </div>
        <div>
          <dt>State snapshots / s</dt>
          <dd data-testid="state-apply-rate">
            {{ controller.metrics().stateApplicationsPerSecond.toFixed(1) }}
          </dd>
        </div>
        <div>
          <dt>Table DOM commits / s</dt>
          <dd data-testid="table-render-rate">
            {{ controller.metrics().tableRendersPerSecond.toFixed(1) }}
          </dd>
        </div>
        <div>
          <dt>P95 / max commit latency (rolling 10 s)</dt>
          <dd>
            {{ controller.metrics().p95RenderMs.toFixed(2) }} ms /
            {{ controller.metrics().maxRenderMs.toFixed(2) }} ms
          </dd>
        </div>
        <div>
          <dt>Worker messages since reset</dt>
          <dd data-testid="worker-messages">
            {{ formatInteger(controller.metrics().workerMessages) }}
          </dd>
        </div>
        <div>
          <dt>Worker-coalesced updates / s</dt>
          <dd data-testid="superseded-update-rate">
            {{ formatRate(controller.metrics().supersededUpdatesPerSecond) }}
          </dd>
        </div>
        <div>
          <dt>Last message samples / updated rows</dt>
          <dd>
            {{ formatInteger(controller.metrics().lastBatchSize) }} /
            {{ formatInteger(controller.metrics().lastUpdateCount) }}
          </dd>
        </div>
        <div>
          <dt>Commits &gt; 16.7 ms since reset</dt>
          <dd>{{ controller.metrics().slowRenders }}</dd>
        </div>
        <div>
          <dt>Observed MutationRecords / s</dt>
          <dd data-testid="dom-mutation-rate">
            {{ formatRate(controller.metrics().domMutationsPerSecond) }}
          </dd>
        </div>
        <div>
          <dt>Long animation frames</dt>
          <dd>
            {{
              controller.longAnimationFramesSupported
                ? formatInteger(controller.metrics().longAnimationFrames)
                : 'Unsupported'
            }}
          </dd>
        </div>
        <div>
          <dt>JS heap (GC-sensitive)</dt>
          <dd>
            {{
              controller.metrics().heapMb === null
                ? 'N/A'
                : controller.metrics().heapMb!.toFixed(1) + ' MB'
            }}
          </dd>
        </div>
      </dl>
      <p class="diagnostic-note">
        MutationObserver counts delivered records, not individual DOM
        operations, and adds profiling overhead. Only class/style attributes,
        text, and child-list changes are observed. Heap is a Chromium-only
        point-in-time value and can move before garbage collection.
      </p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Diagnostics {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatInteger = formatInteger
  readonly formatRate = formatRate
}
