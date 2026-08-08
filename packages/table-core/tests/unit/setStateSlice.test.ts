import { describe, expect, it, vi } from 'vitest'
import {
  constructTable,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
} from '../../src'
import { setStateSlice, stateSlicesEqual } from '../../src/utils'
import {
  table_firstPage,
  table_resetExpanded,
  table_resetSorting,
  table_setPageIndex,
  table_setSorting,
} from '../../src/static-functions'
import { testFeatures } from '../fixtures/features'
import { generateTestColumnDefs } from '../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../fixtures/data/generateTestData'
import type { Table, TableOptions } from '../../src'
import type { Person } from '../fixtures/data/types'

const features = testFeatures({
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
})

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Person> {
  const data = generateTestData(5)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
    ...options,
  })
}

describe('stateSlicesEqual', () => {
  it('should compare primitives with Object.is semantics', () => {
    expect(stateSlicesEqual('a', 'a')).toBe(true)
    expect(stateSlicesEqual('a', 'b')).toBe(false)
    expect(stateSlicesEqual(NaN, NaN)).toBe(true)
    expect(stateSlicesEqual(0, -0)).toBe(false)
    expect(stateSlicesEqual(undefined, undefined)).toBe(true)
    expect(stateSlicesEqual(null, undefined)).toBe(false)
  })

  it('should compare freshly built arrays of objects structurally', () => {
    expect(
      stateSlicesEqual(
        [{ id: 'age', desc: true }],
        [{ id: 'age', desc: true }],
      ),
    ).toBe(true)
    expect(
      stateSlicesEqual(
        [{ id: 'age', desc: true }],
        [{ id: 'age', desc: false }],
      ),
    ).toBe(false)
    expect(stateSlicesEqual([{ id: 'age', desc: true }], [])).toBe(false)
  })

  it('should compare objects of nested arrays structurally', () => {
    expect(
      stateSlicesEqual({ start: ['a'], end: [] }, { start: ['a'], end: [] }),
    ).toBe(true)
    expect(
      stateSlicesEqual({ start: ['a'], end: [] }, { start: [], end: ['a'] }),
    ).toBe(false)
  })

  it('should treat missing and extra keys as different', () => {
    expect(stateSlicesEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(stateSlicesEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
    expect(stateSlicesEqual({ a: undefined }, { b: undefined })).toBe(false)
  })

  it('should compare null-prototype maps against plain objects', () => {
    const map = Object.create(null) as Record<string, boolean>
    map['0'] = true
    expect(stateSlicesEqual(map, { '0': true })).toBe(true)
  })

  it('should compare dates by timestamp', () => {
    expect(stateSlicesEqual(new Date(1000), new Date(1000))).toBe(true)
    expect(stateSlicesEqual(new Date(1000), new Date(2000))).toBe(false)
    expect(stateSlicesEqual(new Date(1000), 1000)).toBe(false)
  })

  it('should compare class instances by reference only', () => {
    class FilterValue {
      constructor(public value: string) {}
    }
    const instance = new FilterValue('a')
    expect(stateSlicesEqual(instance, instance)).toBe(true)
    expect(stateSlicesEqual(instance, new FilterValue('a'))).toBe(false)
  })

  it('should report not-equal past the depth cap instead of recursing forever', () => {
    const make = () => ({ a: { b: { c: { d: { e: 1 } } } } })
    expect(stateSlicesEqual(make(), make())).toBe(false)
  })
})

describe('setStateSlice', () => {
  describe('with the default state updater (uncontrolled state)', () => {
    it('should write a real change through to the base atom', () => {
      const table = makeTable()

      table_setSorting(table, [{ id: 'firstName', desc: false }])

      expect(table.atoms.sorting.get()).toEqual([
        { id: 'firstName', desc: false },
      ])
    })

    it('should run a functional updater exactly once', () => {
      const table = makeTable()
      const updater = vi.fn(() => [{ id: 'firstName', desc: false }])

      table_setSorting(table, updater)

      expect(updater).toHaveBeenCalledTimes(1)
      expect(table.atoms.sorting.get()).toEqual([
        { id: 'firstName', desc: false },
      ])
    })

    it('should not write when the update is a structural no-op', () => {
      const table = makeTable({
        initialState: { sorting: [{ id: 'firstName', desc: false }] },
      })
      const before = table.atoms.sorting.get()

      table_setSorting(table, [{ id: 'firstName', desc: false }])

      expect(table.atoms.sorting.get()).toBe(before)
    })
  })

  describe('with a user-provided change handler (controlled state)', () => {
    it('should pass the original updater through untouched', () => {
      const onSortingChange = vi.fn()
      const table = makeTable({ onSortingChange })
      const updater = () => [{ id: 'firstName', desc: false }]

      table_setSorting(table, updater)

      expect(onSortingChange).toHaveBeenCalledTimes(1)
      expect(onSortingChange.mock.calls[0]?.[0]).toBe(updater)
    })

    it('should not call the handler for a structural no-op', () => {
      const onSortingChange = vi.fn()
      const table = makeTable({
        onSortingChange,
        state: { sorting: [{ id: 'firstName', desc: false }] },
      })

      table_setSorting(table, [{ id: 'firstName', desc: false }])

      expect(onSortingChange).not.toHaveBeenCalled()
    })

    it('should not fire resetSorting when state already matches initial state', () => {
      const onSortingChange = vi.fn()
      const table = makeTable({
        onSortingChange,
        initialState: { sorting: [{ id: 'firstName', desc: true }] },
      })

      table_resetSorting(table)

      expect(onSortingChange).not.toHaveBeenCalled()
    })

    it('should not fire resetExpanded when controlled expanded already matches', () => {
      // Regression coverage for the #6499 render loop: an auto reset firing
      // onExpandedChange with a fresh empty map on every data reference change
      const onExpandedChange = vi.fn()
      const table = makeTable({
        onExpandedChange,
        state: { expanded: {} },
      })

      table_resetExpanded(table)

      expect(onExpandedChange).not.toHaveBeenCalled()
    })

    it('should not fire when a clamped page navigation lands on the current page', () => {
      const onPaginationChange = vi.fn()
      const table = makeTable({ onPaginationChange })

      table_firstPage(table)
      table_setPageIndex(table, -1)

      expect(onPaginationChange).not.toHaveBeenCalled()
    })
  })

  describe('direct calls', () => {
    it('should do nothing when no change handler exists for the key', () => {
      const table = makeTable()

      expect(() =>
        setStateSlice(table as any, 'nonexistentSlice', 'value'),
      ).not.toThrow()
    })
  })
})
