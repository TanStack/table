import { coreCellsFeature } from './cells/coreCellsFeature'
import { coreColumnsFeature } from './columns/coreColumnsFeature'
import { coreHeadersFeature } from './headers/coreHeadersFeature'
import { coreRowModelsFeature } from './row-models/coreRowModelsFeature'
import { coreRowsFeature } from './rows/coreRowsFeature'
import { coreTablesFeature } from './table/coreTablesFeature'
import type { TableReactivityBindings } from '../reactivity'

export interface CoreFeatures {
  coreReactivityFeature?: TableReactivityBindings
  coreCellsFeature: typeof coreCellsFeature
  coreColumnsFeature: typeof coreColumnsFeature
  coreHeadersFeature: typeof coreHeadersFeature
  coreRowModelsFeature: typeof coreRowModelsFeature
  coreRowsFeature: typeof coreRowsFeature
  coreTablesFeature: typeof coreTablesFeature
}

/**
 * The built-in core feature set required by every table.
 *
 * These features provide table, column, row, header, cell, and core row-model behavior before optional feature plugins are added.
 */
export const coreFeatures: CoreFeatures = {
  coreCellsFeature,
  coreColumnsFeature,
  coreHeadersFeature,
  coreRowModelsFeature,
  coreRowsFeature,
  coreTablesFeature,
}
