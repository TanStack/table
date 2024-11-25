import { cellsFeature } from './cells/cellsFeature'
import { columnsFeature } from './columns/columnsFeature'
import { headersFeature } from './headers/headersFeature'
import { rowModelsFeature } from './row-models/rowModelsFeature'
import { rowsFeature } from './rows/rowsFeature'
import { tablesFeature } from './table/tablesFeature'
import type { CoreTableFeatures } from '../types/TableFeatures'

export const coreFeatures: CoreTableFeatures = {
  cellsFeature,
  columnsFeature,
  headersFeature,
  rowsFeature,
  rowModelsFeature,
  tablesFeature,
}
