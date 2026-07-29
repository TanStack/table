import { describe, expect, test, vi } from 'vitest'
import { createRoot, getOwner, runWithOwner } from 'solid-js'
import { stockFeatures } from '@tanstack/table-core'
import { FlexRender, flexRender } from '../../src/FlexRender'
import { createTable } from '../../src/createTable'
import { createTableHook } from '../../src/createTableHook'
import type { ColumnDef } from '@tanstack/table-core'

function resolveSolidOutput(value: unknown): unknown {
  let current = value
  while (typeof current === 'function') {
    current = current()
  }
  return current
}

describe('FlexRender', () => {
  type Data = { id: string; name: string }
  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => `header:${column.id}`,
      cell: ({ getValue }) => `cell:${getValue()}`,
      aggregatedCell: ({ getValue }) => `aggregate:${getValue()}`,
      footer: ({ column }) => `footer:${column.id}`,
    },
  ]

  test('flexRender handles empty, static, and component templates', () => {
    createRoot((dispose) => {
      expect(flexRender(undefined, { value: 'unused' })).toBeNull()
      expect(flexRender('static', { value: 'unused' })).toBe('static')

      const Component = vi.fn((props: { value: string }) => {
        return `component:${props.value}`
      })

      expect(flexRender(Component, { value: 'rendered' })).toBe(
        'component:rendered',
      )
      expect(Component).toHaveBeenCalledWith({ value: 'rendered' })
      dispose()
    })
  })

  test('renders cell, aggregate, placeholder, header, and footer templates', () => {
    createRoot((dispose) => {
      const table = createTable({
        data: [{ id: '1', name: 'Ada' }],
        columns,
        features: stockFeatures,
        getRowId: (row) => row.id,
      })
      const cell = table.getRowModel().rows[0]!.getAllCells()[0]!
      const header = table.getHeaderGroups()[0]!.headers[0]!
      const footer = table.getFooterGroups()[0]!.headers[0]!

      expect(resolveSolidOutput(FlexRender({ cell }))).toBe('cell:Ada')
      expect(resolveSolidOutput(FlexRender({ header }))).toBe('header:name')
      expect(resolveSolidOutput(FlexRender({ footer }))).toBe('footer:name')

      vi.spyOn(cell, 'getIsAggregated').mockReturnValue(true)
      expect(resolveSolidOutput(FlexRender({ cell }))).toBe('aggregate:Ada')

      vi.spyOn(cell, 'getIsAggregated').mockReturnValue(false)
      vi.spyOn(cell, 'getIsPlaceholder').mockReturnValue(true)
      expect(resolveSolidOutput(FlexRender({ cell }))).toBeNull()
      dispose()
    })
  })
})

describe('createTableHook runtime', () => {
  type Data = { id: string; name: string }
  const TableBadge = () => 'table-badge'
  const CellBadge = () => 'cell-badge'
  const HeaderBadge = () => 'header-badge'

  function createTestHook() {
    return createTableHook({
      features: stockFeatures,
      enableRowSelection: false,
      getRowId: (row) => row.id,
      tableComponents: { TableBadge },
      cellComponents: { CellBadge },
      headerComponents: { HeaderBadge },
    })
  }

  test('binds features and components while per-table options override defaults', () => {
    const hook = createTestHook()
    const columnHelper = hook.createAppColumnHelper<Data>()
    const columns = columnHelper.columns([
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ getValue }) => getValue(),
      }),
    ])

    createRoot((dispose) => {
      const table = hook.createAppTable({
        data: [{ id: '1', name: 'Ada' }],
        columns,
        enableRowSelection: true,
      })

      expect(hook.appFeatures).toBe(stockFeatures)
      expect(table.getRow('1').getCanSelect()).toBe(true)
      expect(table.TableBadge).toBe(TableBadge)
      expect(table.FlexRender).toBe(FlexRender)
      expect(table.AppTable).toEqual(expect.any(Function))
      expect(table.AppCell).toEqual(expect.any(Function))
      expect(table.AppHeader).toEqual(expect.any(Function))
      expect(table.AppFooter).toEqual(expect.any(Function))
      dispose()
    })
  })

  test('provides table, cell, and header contexts with bound render helpers', () => {
    const hook = createTestHook()
    const columnHelper = hook.createAppColumnHelper<Data>()
    const columns = columnHelper.columns([
      columnHelper.accessor('name', {
        header: ({ column }) => `header:${column.id}`,
        cell: ({ getValue }) => `cell:${getValue()}`,
        footer: ({ column }) => `footer:${column.id}`,
      }),
    ])
    let dispose!: () => void
    const { owner, table } = createRoot((rootDispose) => {
      dispose = rootDispose
      return {
        owner: getOwner()!,
        table: hook.createAppTable({
          data: [{ id: '1', name: 'Ada' }],
          columns,
        }),
      }
    })

    try {
      runWithOwner(owner, () => {
        let tableFromContext: unknown
        const tableOutput = table.AppTable({
          get children() {
            tableFromContext = hook.useTableContext<Data>()
            return 'inside-table'
          },
        })
        expect(resolveSolidOutput(tableOutput)).toBe('inside-table')
        expect(tableFromContext).toBe(table)

        const cell = table.getRow('1').getAllCells()[0]!
        let cellFromContext: unknown
        let extendedCell: unknown
        const cellOutput = table.AppCell({
          cell,
          children: (value) => {
            extendedCell = value
            cellFromContext = hook.useCellContext<string>()
            expect(value.CellBadge).toBe(CellBadge)
            return value.FlexRender()
          },
        })
        expect(resolveSolidOutput(cellOutput)).toBe('cell:Ada')
        expect(extendedCell).toBe(cell)
        expect(cellFromContext).toBe(cell)

        const header = table.getHeaderGroups()[0]!.headers[0]!
        let headerFromContext: unknown
        const headerOutput = table.AppHeader({
          header,
          children: (value) => {
            headerFromContext = hook.useHeaderContext<string>()
            expect(value.HeaderBadge).toBe(HeaderBadge)
            return value.FlexRender()
          },
        })
        expect(resolveSolidOutput(headerOutput)).toBe('header:name')
        expect(headerFromContext).toBe(header)

        const footer = table.getFooterGroups()[0]!.headers[0]!
        const footerOutput = table.AppFooter({
          header: footer,
          children: (value) => value.FlexRender(),
        })
        expect(resolveSolidOutput(footerOutput)).toBe('footer:name')
      })
    } finally {
      dispose()
    }
  })

  test('context hooks fail with actionable errors outside their providers', () => {
    const hook = createTestHook()

    expect(() => hook.useTableContext()).toThrow(
      '`useTableContext` must be used within an `AppTable` component',
    )
    expect(() => hook.useCellContext()).toThrow(
      '`useCellContext` must be used within an `AppCell` component',
    )
    expect(() => hook.useHeaderContext()).toThrow(
      '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component',
    )
  })
})
