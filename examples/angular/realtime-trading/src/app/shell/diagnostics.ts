import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../core/trading-benchmark.controller'
import { formatInteger } from './shell-formatters'

@Component({
  selector: 'app-diagnostics',
  template: `
    <section class="config-section diagnostics" aria-labelledby="diagnostics">
      <h2 id="diagnostics">DIAGNOSTICS</h2>
      <dl>
        <div>
          <dt>Mounted cells</dt>
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
          <dt>Worker messages</dt>
          <dd data-testid="worker-messages">
            {{ formatInteger(controller.metrics().workerMessages) }}
          </dd>
        </div>
        <div>
          <dt>Last batch events / rows</dt>
          <dd>
            {{ formatInteger(controller.metrics().lastBatchSize) }} /
            {{ formatInteger(controller.metrics().lastUpdateCount) }}
          </dd>
        </div>
        <div>
          <dt>Renders &gt; 16.7 ms</dt>
          <dd>{{ controller.metrics().slowRenders }}</dd>
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
          <dt>JS heap</dt>
          <dd>
            {{
              controller.metrics().heapMb === null
                ? 'N/A'
                : controller.metrics().heapMb!.toFixed(1) + ' MB'
            }}
          </dd>
        </div>
      </dl>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Diagnostics {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatInteger = formatInteger
}
