import { coreCellsFeature } from './cells/coreCellsFeature'
import { coreColumnsFeature } from './columns/coreColumnsFeature'
import { coreHeadersFeature } from './headers/coreHeadersFeature'
import { coreRowModelsFeature } from './row-models/coreRowModelsFeature'
import { coreRowsFeature } from './rows/coreRowsFeature'
import { coreTablesFeature } from './table/coreTablesFeature'

export interface CoreFeatures {
  coreCellsFeature: typeof coreCellsFeature
  coreColumnsFeature: typeof coreColumnsFeature
  coreHeadersFeature: typeof coreHeadersFeature
  coreRowModelsFeature: typeof coreRowModelsFeature
  coreRowsFeature: typeof coreRowsFeature
  coreTablesFeature: typeof coreTablesFeature
}

export const coreFeatures: CoreFeatures = {
  coreCellsFeature,
  coreColumnsFeature,
  coreHeadersFeature,
  coreRowsFeature,
  coreRowModelsFeature,
  coreTablesFeature,
}
