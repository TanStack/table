import { For, createSignal } from 'solid-js'
import { JsonTree } from '@tanstack/devtools-ui'
import { useStore } from '@tanstack/solid-store'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useStyles } from '../styles/use-styles'
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
  const tableInstance = table()
  const tableState = tableInstance
    ? useStore(tableInstance.store, (state) => state)
    : undefined

  const [selectedRowModel, setSelectedRowModel] =
    createSignal<(typeof ROW_MODEL_GETTERS)[number]>('getRowModel')

  const getRawData = (): unknown => {
    tableState?.()
    if (!tableInstance) {
      return {
        message:
          'No table instance is connected. Pass a table instance to TableDevtoolsPanel.',
      }
    }
    const data = tableInstance.options.data as Array<unknown>
    if (!Array.isArray(data)) return data
    if (data.length <= ROW_LIMIT) return data as unknown
    return data.slice(0, ROW_LIMIT) as unknown
  }

  const getRawDataTotalCount = (): number => {
    tableState?.()
    if (!tableInstance) return 0
    const data = tableInstance.options.data as Array<unknown>
    return Array.isArray(data) ? data.length : 0
  }

  const getColumns = (): Array<AnyColumn> => {
    tableState?.()
    if (!tableInstance) return []

    const tableWithColumnFns = tableInstance as unknown as {
      getVisibleLeafColumns?: () => Array<AnyColumn>
      getAllLeafColumns?: () => Array<AnyColumn>
    }

    return (
      tableWithColumnFns.getVisibleLeafColumns?.() ??
      tableWithColumnFns.getAllLeafColumns?.() ??
      []
    )
  }

  const getAllRows = (): Array<AnyRow> => {
    tableState?.()
    selectedRowModel()
    const getter = tableInstance?.[selectedRowModel()] as
      | (() => { rows: Array<AnyRow> })
      | undefined
    return getter?.().rows ?? []
  }

  const getRows = (): Array<AnyRow> => {
    const rows = getAllRows()
    return rows.length <= ROW_LIMIT ? rows : rows.slice(0, ROW_LIMIT)
  }

  const getRowsTotalCount = (): number => getAllRows().length

  const getCells = (row: AnyRow): Array<AnyCell> => {
    tableState?.()
    const rowWithMaybeVisibleCells = row as unknown as {
      getVisibleCells?: () => Array<AnyCell>
    }
    return rowWithMaybeVisibleCells.getVisibleCells?.() ?? row.getAllCells()
  }

  const getAvailableGetters = (): Array<(typeof ROW_MODEL_GETTERS)[number]> => {
    if (!tableInstance) return []
    return ROW_MODEL_GETTERS.filter(
      (name) => typeof tableInstance[name] === 'function',
    )
  }

  return (
    <div class={styles().panelScroll}>
      <ResizableSplit
        left={
          <>
            <div class={styles().sectionTitle}>
              Raw Data
              {getRawDataTotalCount() > ROW_LIMIT && (
                <span class={styles().rowLimitNote}>
                  {' '}
                  (First {ROW_LIMIT} rows)
                </span>
              )}
            </div>
            <JsonTree copyable value={getRawData()} />
          </>
        }
        right={
          <>
            <div class={styles().sectionTitle}>
              Rows ({getRows().length}
              {getRowsTotalCount() > ROW_LIMIT && ` of ${getRowsTotalCount()}`})
              {getRowsTotalCount() > ROW_LIMIT && (
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
                    e.currentTarget.value as (typeof ROW_MODEL_GETTERS)[number],
                  )
                }
              >
                <For each={getAvailableGetters()}>
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
                    <For each={getColumns()}>
                      {(column) => (
                        <th class={styles().headerCell}>{column.id}</th>
                      )}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={getRows()}>
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
  )
}
