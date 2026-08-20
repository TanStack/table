import { initTableWorker } from '@tanstack/react-table/experimental-worker-plugin'
import { columns, sharedFeatures } from './tableConfig'

// The entire worker: a headless shadow table running the real table-core
// row model pipeline off the main thread.
initTableWorker({ features: sharedFeatures, columns })
