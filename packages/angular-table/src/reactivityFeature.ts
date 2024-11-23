import { signal } from '@angular/core'
import type { TableFeature } from '@tanstack/table-core'

export const reactivityFeature: TableFeature = {
  constructTableAPIs: (table) => {
    const notifier = signal(
      {},
      { debugName: 'tanstackTableNotifier', equal: () => false },
    )
    table._signalNotifier = notifier.asReadonly()
    table._notify = () => notifier.set({})
  },
}
