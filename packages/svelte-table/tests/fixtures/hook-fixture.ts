import { stockFeatures } from '@tanstack/table-core'
import { createTableHook } from '../../src/createTableHook.svelte'
import CellBadge from './HookCellBadge.svelte'
import HeaderBadge from './HookHeaderBadge.svelte'
import TableBadge from './HookTableBadge.svelte'

export type HookData = { id: string; title: string }

export const hook = createTableHook({
  features: stockFeatures,
  enableRowSelection: false,
  getRowId: (row: HookData) => `row-${row.id}`,
  tableComponents: { TableBadge },
  cellComponents: { CellBadge },
  headerComponents: { HeaderBadge },
})
