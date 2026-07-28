import { describe, expect, it, vi } from 'vitest'
import {
  constructTable,
  createExpandedRowModel,
  rowExpandingFeature,
} from '../../../../src'
import {
  getDefaultExpandedState,
  row_getCanExpand,
  row_getIsAllParentsExpanded,
  row_getIsExpanded,
  row_getToggleExpandedHandler,
  row_toggleExpanded,
  table_autoResetExpanded,
  table_getCanSomeRowsExpand,
  table_getExpandedDepth,
  table_getIsAllRowsExpanded,
  table_getIsSomeRowsExpanded,
  table_getToggleAllRowsExpandedHandler,
  table_resetExpanded,
  table_setExpanded,
  table_toggleAllRowsExpanded,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { ExpandedState, Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
})

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0))

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
  lengths: Array<number> = [3, 2],
): Table<typeof features, Person> {
  const data = generateTestData(...lengths)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
    getSubRows: (row) => row.subRows,
    ...options,
  })
}

describe('getDefaultExpandedState', () => {
  it('should return an empty map and a new instance each time', () => {
    expect(getDefaultExpandedState()).toEqual({})
    expect(getDefaultExpandedState()).not.toBe(getDefaultExpandedState())
  })
})

describe('table_setExpanded', () => {
  it('should route the updater through onExpandedChange', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({ onExpandedChange })

    table_setExpanded(table, { '0': true })

    expect(onExpandedChange).toHaveBeenCalledWith({ '0': true })
  })
})

describe('table_resetExpanded', () => {
  it('should reset to an empty map when defaultState is true', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({
      onExpandedChange,
      initialState: { expanded: { '0': true } },
    })

    table_resetExpanded(table, true)

    expect(onExpandedChange).toHaveBeenCalledWith({})
  })

  it('should reset to the initial expanded map by default', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({
      onExpandedChange,
      initialState: { expanded: { '0': true } },
    })

    table_resetExpanded(table)

    expect(onExpandedChange).toHaveBeenCalledWith({ '0': true })
  })

  it('should preserve an expanded-all initial state', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({
      onExpandedChange,
      initialState: { expanded: true },
    })

    table_resetExpanded(table)

    expect(onExpandedChange).toHaveBeenCalledWith(true)
  })
})

describe('table_toggleAllRowsExpanded', () => {
  it('should expand all rows when not all rows are expanded', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({ onExpandedChange })

    table_toggleAllRowsExpanded(table)

    expect(onExpandedChange).toHaveBeenCalledWith(true)
  })

  it('should collapse all rows when all rows are expanded', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({
      onExpandedChange,
      initialState: { expanded: true },
    })

    table_toggleAllRowsExpanded(table)

    expect(onExpandedChange).toHaveBeenCalledWith({})
  })

  it('should apply an explicit value without toggling', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({ onExpandedChange })

    table_toggleAllRowsExpanded(table, false)

    expect(onExpandedChange).toHaveBeenCalledWith({})
  })
})

describe('table_getCanSomeRowsExpand', () => {
  it('should return true when rows have subRows', () => {
    const table = makeTable()

    expect(table_getCanSomeRowsExpand(table)).toBe(true)
  })

  it('should return false for flat data', () => {
    const table = makeTable(undefined, [3])

    expect(table_getCanSomeRowsExpand(table)).toBe(false)
  })
})

describe('table_getIsSomeRowsExpanded', () => {
  it('should return false with no expanded rows', () => {
    const table = makeTable()

    expect(table_getIsSomeRowsExpanded(table)).toBe(false)
  })

  it('should return true when a row id is expanded', () => {
    const table = makeTable({ initialState: { expanded: { '0': true } } })

    expect(table_getIsSomeRowsExpanded(table)).toBe(true)
  })

  it('should return true for the expanded-all state', () => {
    const table = makeTable({ initialState: { expanded: true } })

    expect(table_getIsSomeRowsExpanded(table)).toBe(true)
  })
})

describe('table_getIsAllRowsExpanded', () => {
  it('should return true for the expanded-all state', () => {
    const table = makeTable({ initialState: { expanded: true } })

    expect(table_getIsAllRowsExpanded(table)).toBe(true)
  })

  it('should return false for an empty expanded state', () => {
    const table = makeTable()

    expect(table_getIsAllRowsExpanded(table)).toBe(false)
  })

  it('should return true when every row id is expanded', () => {
    const table = makeTable()
    const allExpanded = Object.fromEntries(
      Object.keys(table.getCoreRowModel().rowsById).map((id) => [id, true]),
    ) as ExpandedState
    table.baseAtoms.expanded.set(allExpanded)

    expect(table_getIsAllRowsExpanded(table)).toBe(true)
  })

  it('should return false when any row is collapsed', () => {
    const table = makeTable({ initialState: { expanded: { '0': true } } })

    expect(table_getIsAllRowsExpanded(table)).toBe(false)
  })
})

describe('table_getExpandedDepth', () => {
  it('should return 0 with nothing expanded', () => {
    const table = makeTable()

    expect(table_getExpandedDepth(table)).toBe(0)
  })

  it('should measure depth from expanded row ids', () => {
    expect(
      table_getExpandedDepth(
        makeTable({ initialState: { expanded: { '0': true } } }),
      ),
    ).toBe(1)
    expect(
      table_getExpandedDepth(
        makeTable({ initialState: { expanded: { '0.0': true } } }),
      ),
    ).toBe(2)
  })

  it('should measure depth from the row model for the expanded-all state', () => {
    const table = makeTable({ initialState: { expanded: true } })

    expect(table_getExpandedDepth(table)).toBe(2)
  })
})

describe('row_toggleExpanded', () => {
  it('should expand a collapsed row', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({ onExpandedChange })

    row_toggleExpanded(table.getRow('0'))

    expect(getUpdaterResult(onExpandedChange, {})).toEqual({ '0': true })
  })

  it('should collapse an expanded row and keep other expanded rows', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({
      onExpandedChange,
      initialState: { expanded: { '0': true, '1': true } },
    })

    row_toggleExpanded(table.getRow('0'))

    expect(
      getUpdaterResult(onExpandedChange, { '0': true, '1': true }),
    ).toEqual({ '1': true })
  })

  it('should return the previous state unchanged for a redundant expand', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({
      onExpandedChange,
      initialState: { expanded: { '0': true } },
    })

    row_toggleExpanded(table.getRow('0'), true)

    const old = { '0': true }
    expect(getUpdaterResult(onExpandedChange, old)).toBe(old)
  })

  it('should materialize the expanded-all state when collapsing one row', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({
      onExpandedChange,
      initialState: { expanded: true },
    })

    row_toggleExpanded(table.getRow('0'))

    const result = getUpdaterResult(onExpandedChange, true)
    expect(result['0']).toBeUndefined()
    expect(result['1']).toBe(true)
    expect(result['0.1']).toBe(true)
  })
})

describe('row_getIsExpanded', () => {
  it('should read the expanded state for this row id', () => {
    const table = makeTable({ initialState: { expanded: { '0': true } } })

    expect(row_getIsExpanded(table.getRow('0'))).toBe(true)
    expect(row_getIsExpanded(table.getRow('1'))).toBe(false)
  })

  it('should return true for every row in the expanded-all state', () => {
    const table = makeTable({ initialState: { expanded: true } })

    expect(row_getIsExpanded(table.getRow('0'))).toBe(true)
    expect(row_getIsExpanded(table.getRow('1'))).toBe(true)
  })

  it('should let options.getIsRowExpanded override the state', () => {
    const table = makeTable({
      getIsRowExpanded: (row) => row.id === '1',
      initialState: { expanded: { '0': true } },
    })

    expect(row_getIsExpanded(table.getRow('0'))).toBe(false)
    expect(row_getIsExpanded(table.getRow('1'))).toBe(true)
  })
})

describe('row_getCanExpand', () => {
  it('should return true for rows with subRows', () => {
    const table = makeTable()

    expect(row_getCanExpand(table.getRow('0'))).toBe(true)
  })

  it('should return false for leaf rows', () => {
    const table = makeTable()

    expect(row_getCanExpand(table.getRow('0.0', true))).toBe(false)
  })

  it('should return false when expanding is disabled', () => {
    const table = makeTable({ enableExpanding: false })

    expect(row_getCanExpand(table.getRow('0'))).toBe(false)
  })

  it('should let options.getRowCanExpand win', () => {
    const table = makeTable({ getRowCanExpand: (row) => row.id === '0.0' })

    expect(row_getCanExpand(table.getRow('0'))).toBe(false)
    expect(row_getCanExpand(table.getRow('0.0', true))).toBe(true)
  })
})

describe('row_getIsAllParentsExpanded', () => {
  it('should return true for top-level rows', () => {
    const table = makeTable()

    expect(row_getIsAllParentsExpanded(table.getRow('0'))).toBe(true)
  })

  it('should return true when the parent chain is expanded', () => {
    const table = makeTable({ initialState: { expanded: { '0': true } } })

    expect(row_getIsAllParentsExpanded(table.getRow('0.0', true))).toBe(true)
  })

  it('should return false when a parent is collapsed', () => {
    const table = makeTable()

    expect(row_getIsAllParentsExpanded(table.getRow('0.0', true))).toBe(false)
  })
})

describe('handlers', () => {
  it('table_getToggleAllRowsExpandedHandler should toggle all rows expanded', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({ onExpandedChange })

    table_getToggleAllRowsExpandedHandler(table)({})

    expect(onExpandedChange).toHaveBeenCalledWith(true)
  })

  it('row_getToggleExpandedHandler should toggle expandable rows', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({ onExpandedChange })

    row_getToggleExpandedHandler(table.getRow('0'))()

    expect(getUpdaterResult(onExpandedChange, {})).toEqual({ '0': true })
  })

  it('row_getToggleExpandedHandler should be a no-op for leaf rows', () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({ onExpandedChange })

    row_getToggleExpandedHandler(table.getRow('0.0', true))()

    expect(onExpandedChange).not.toHaveBeenCalled()
  })
})

describe('table_autoResetExpanded', () => {
  it('should schedule a reset to the initial expanded state', async () => {
    const table = makeTable({ initialState: { expanded: { '0': true } } })

    table.getRow('1').toggleExpanded()
    expect(table.atoms.expanded.get()).toEqual({ '0': true, '1': true })

    table_autoResetExpanded(table)
    await flushMicrotasks()

    expect(table.atoms.expanded.get()).toEqual({ '0': true })
  })

  it('should not reset when manualExpanding is set', async () => {
    const onExpandedChange = vi.fn()
    const table = makeTable({ onExpandedChange, manualExpanding: true })

    table_autoResetExpanded(table)
    await flushMicrotasks()

    expect(onExpandedChange).not.toHaveBeenCalled()
  })
})
