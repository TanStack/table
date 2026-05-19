import { For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { JsonTree } from '@tanstack/devtools-ui'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { NoTableConnected } from './NoTableConnected'
import { ResizableSplit } from './ResizableSplit'

import type {
  Cell,
  Column,
  Row,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'

type AnyRow = Row<TableFeatures, RowData>
type AnyCell = Cell<TableFeatures, RowData>
type AnyColumn = Column<TableFeatures, any>

const ROW_LIMIT = 100

const ROW_MODEL_GETTERS = [
  'getRowModel',
  'getCoreRowModel',
  'getFilteredRowModel',
  'getGroupedRowModel',
  'getSortedRowModel',
  'getExpandedRowModel',
  'getPaginatedRowModel',
] as const

function stringifyValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  if (value instanceof Date) return value.toISOString()

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function RowsPanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()
  const tableState = useTableStore(
    () => table()?.store,
    (state) => state,
  )
  const tableOptions = useTableStore(
    () => {
      const tableInstance = table()
      return tableInstance?.optionsStore ?? tableInstance?.store
    },
    () => table()?.options as unknown,
  )

  const [selectedRowModel, setSelectedRowModel] =
    createSignal<(typeof ROW_MODEL_GETTERS)[number]>('getRowModel')

  const rawData = createMemo((): unknown => {
    const tableInstance = table()
    if (!tableInstance) return undefined

    tableState()
    tableOptions()

    const data = tableInstance.options.data as ReadonlyArray<unknown>
    if (!Array.isArray(data)) return data
    if (data.length <= ROW_LIMIT) return data as unknown
    return data.slice(0, ROW_LIMIT) as unknown
  })

  const rawDataTotalCount = createMemo((): number => {
    const tableInstance = table()
    if (!tableInstance) return 0

    tableState()
    tableOptions()

    const data = tableInstance.options.data as ReadonlyArray<unknown>
    return Array.isArray(data) ? data.length : 0
  })

  const columns = createMemo((): Array<AnyColumn> => {
    const tableInstance = table()
    if (!tableInstance) return []

    tableState()
    tableOptions()

    const tableWithColumnFns = tableInstance as unknown as {
      getVisibleLeafColumns?: () => Array<AnyColumn>
      getAllLeafColumns?: () => Array<AnyColumn>
    }

    return (
      tableWithColumnFns.getVisibleLeafColumns?.() ??
      tableWithColumnFns.getAllLeafColumns?.() ??
      []
    )
  })

  const availableGetters = createMemo(
    (): Array<(typeof ROW_MODEL_GETTERS)[number]> => {
      const tableInstance = table()
      if (!tableInstance) return []

      const tableRecord = tableInstance as unknown as Record<string, unknown>

      return ROW_MODEL_GETTERS.filter(
        (name) => typeof tableRecord[name] === 'function',
      )
    },
  )

  createEffect(() => {
    const getters = availableGetters()
    if (getters.length === 0) return

    const currentGetter = selectedRowModel()
    if (!getters.includes(currentGetter)) {
      setSelectedRowModel(getters[0]!)
    }
  })

  const allRows = createMemo((): Array<AnyRow> => {
    const tableInstance = table()
    if (!tableInstance) return []

    tableState()

    const tableRecord = tableInstance as unknown as Record<string, unknown>
    const getter = tableRecord[selectedRowModel()] as
      | (() => { rows: Array<AnyRow> })
      | undefined

    return getter?.().rows ?? []
  })

  const rows = createMemo((): Array<AnyRow> => {
    const nextRows = allRows()
    if (nextRows.length <= ROW_LIMIT) return nextRows
    return nextRows.slice(0, ROW_LIMIT)
  })

  const rowsTotalCount = createMemo(() => allRows().length)

  const getCells = (row: AnyRow): Array<AnyCell> => {
    const rowWithMaybeVisibleCells = row as unknown as {
      getVisibleCells?: () => Array<AnyCell>
    }
    return rowWithMaybeVisibleCells.getVisibleCells?.() ?? row.getAllCells()
  }

  return (
    <Show fallback={<NoTableConnected title="Rows" />} when={table()}>
      <div class={styles().panelScroll}>
        <ResizableSplit
          left={
            <>
              <div class={styles().sectionTitle}>
                Raw Data
                {rawDataTotalCount() > ROW_LIMIT && (
                  <span class={styles().rowLimitNote}>
                    {' '}
                    (First {ROW_LIMIT} rows)
                  </span>
                )}
              </div>
              <JsonTree copyable value={rawData()} />
            </>
          }
          right={
            <>
              <div class={styles().sectionTitle}>
                Rows ({rows().length}
                {rowsTotalCount() > ROW_LIMIT && ` of ${rowsTotalCount()}`})
                {rowsTotalCount() > ROW_LIMIT && (
                  <span class={styles().rowLimitNote}>
                    {' '}
                    — First {ROW_LIMIT} rows
                  </span>
                )}
              </div>
              <div class={styles().rowModelSelectRow}>
                <label for="row-model-select">View:</label>
                <select
                  id="row-model-select"
                  class={styles().rowModelSelect}
                  value={selectedRowModel()}
                  onChange={(e) =>
                    setSelectedRowModel(
                      e.currentTarget
                        .value as (typeof ROW_MODEL_GETTERS)[number],
                    )
                  }
                >
                  <For each={availableGetters()}>
                    {(getterName) => (
                      <option value={getterName}>{getterName}</option>
                    )}
                  </For>
                </select>
              </div>
              <div class={styles().tableWrapper}>
                <table class={styles().rowsTable}>
                  <thead>
                    <tr>
                      <th class={styles().headerCell}>#</th>
                      <For each={columns()}>
                        {(column) => (
                          <th class={styles().headerCell}>{column.id}</th>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={rows()}>
                      {(row) => (
                        <tr>
                          <td class={styles().bodyCellMono}>{row.id}</td>
                          <For each={getCells(row)}>
                            {(cell) => (
                              <td class={styles().bodyCell}>
                                {stringifyValue(cell.getValue())}
                              </td>
                            )}
                          </For>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </>
          }
        />
      </div>
    </Show>
  )
}
