import { coreCellsFeature } from './cells/coreCellsFeature'
import { coreColumnsFeature } from './columns/coreColumnsFeature'
import { coreHeadersFeature } from './headers/coreHeadersFeature'
import { coreRowModelsFeature } from './row-models/coreRowModelsFeature'
import { coreRowsFeature } from './rows/coreRowsFeature'
import { coreTablesFeature } from './table/coreTablesFeature'

export const coreFeatures = {
  coreCellsFeature,
  coreColumnsFeature,
  coreHeadersFeature,
  coreRowsFeature,
  coreRowModelsFeature,
  coreTablesFeature,
} as const

export type CoreFeatures = typeof coreFeatures
