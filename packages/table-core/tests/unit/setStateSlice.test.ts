import { describe, expect, it, vi } from 'vitest'
import { createAtom } from '@tanstack/store'
import {
  constructTable,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
} from '../../src'
import {
  functionalUpdate,
  setStateSlice,
  stateSlicesEqual,
} from '../../src/utils'
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
import type { SortingState, Table, TableOptions, Updater } from '../../src'
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

  it('should compare three container levels used by stock state', () => {
    expect(
      stateSlicesEqual(
        [{ id: 'age', value: [0, 10] }],
        [{ id: 'age', value: [0, 10] }],
      ),
    ).toBe(true)
    expect(
      stateSlicesEqual(
        { columnSizingStart: [['age', 100]] },
        { columnSizingStart: [['age', 100]] },
      ),
    ).toBe(true)

    const makeTooDeep = () => ({ a: { b: { c: { d: 1 } } } })
    expect(stateSlicesEqual(makeTooDeep(), makeTooDeep())).toBe(false)
  })

  it('should treat missing and extra keys as different', () => {
    expect(stateSlicesEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(stateSlicesEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
    expect(stateSlicesEqual({ a: undefined }, { b: undefined })).toBe(false)
  })

  it('should distinguish sparse entries and extra array properties', () => {
    expect(stateSlicesEqual(new Array(1), [undefined])).toBe(false)

    const a: Array<unknown> & { mode?: string } = []
    const b: Array<unknown> & { mode?: string } = []
    a.mode = 'include'
    b.mode = 'exclude'
    expect(stateSlicesEqual(a, b)).toBe(false)
  })

  it('should include enumerable symbol keys', () => {
    const key = Symbol('filter')
    expect(stateSlicesEqual({ [key]: 'a' }, { [key]: 'b' })).toBe(false)
    expect(stateSlicesEqual({ [key]: 'a' }, { [key]: 'a' })).toBe(true)
  })

  it('should compare null-prototype maps against plain objects', () => {
    const map = Object.create(null) as Record<string, boolean>
    map['0'] = true
    expect(stateSlicesEqual(map, { '0': true })).toBe(true)
  })

  it('should compare non-plain values like dates by reference only', () => {
    const date = new Date(1000)
    expect(stateSlicesEqual(date, date)).toBe(true)
    expect(stateSlicesEqual(new Date(1000), new Date(1000))).toBe(false)
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
    it('should resolve an updater only when the state owner applies it', () => {
      const onSortingChange = vi.fn()
      const table = makeTable({ onSortingChange })
      const updater = vi.fn((): SortingState => [
        { id: 'firstName', desc: false },
      ])

      table_setSorting(table, updater)

      expect(onSortingChange).toHaveBeenCalledTimes(1)
      expect(updater).not.toHaveBeenCalled()

      const ownerUpdater = onSortingChange.mock.calls[0]![0]
      expect(functionalUpdate(ownerUpdater, [])).toEqual([
        { id: 'firstName', desc: false },
      ])
      expect(updater).toHaveBeenCalledTimes(1)
    })

    it('should invoke the handler but preserve the owner reference for a structural no-op', () => {
      const onSortingChange = vi.fn()
      const sorting: SortingState = [{ id: 'firstName', desc: false }]
      const table = makeTable({
        onSortingChange,
        state: { sorting },
      })

      table_setSorting(table, [{ id: 'firstName', desc: false }])

      expect(onSortingChange).toHaveBeenCalledTimes(1)
      expect(functionalUpdate(onSortingChange.mock.calls[0]![0], sorting)).toBe(
        sorting,
      )
    })

    it('should preserve the owner reference when resetSorting already matches', () => {
      const onSortingChange = vi.fn()
      const sorting: SortingState = [{ id: 'firstName', desc: true }]
      const table = makeTable({
        onSortingChange,
        initialState: { sorting },
      })

      table_resetSorting(table)

      expect(onSortingChange).toHaveBeenCalledTimes(1)
      expect(functionalUpdate(onSortingChange.mock.calls[0]![0], sorting)).toBe(
        sorting,
      )
    })

    it('should preserve controlled expanded identity when resetExpanded already matches', () => {
      const onExpandedChange = vi.fn()
      const expanded = {}
      const table = makeTable({
        onExpandedChange,
        state: { expanded },
      })

      table_resetExpanded(table)

      expect(onExpandedChange).toHaveBeenCalledTimes(1)
      expect(
        functionalUpdate(onExpandedChange.mock.calls[0]![0], expanded),
      ).toBe(expanded)
    })

    it('should preserve pagination identity for clamped navigation no-ops', () => {
      const onPaginationChange = vi.fn()
      const table = makeTable({ onPaginationChange })
      const pagination = table.atoms.pagination.get()

      table_firstPage(table)
      table_setPageIndex(table, -1)

      expect(onPaginationChange).toHaveBeenCalledTimes(2)
      const result = onPaginationChange.mock.calls.reduce(
        (state, [updater]) => functionalUpdate(updater, state),
        pagination,
      )
      expect(result).toBe(pagination)
    })

    it('should compose a real update followed by a locally apparent no-op', () => {
      const queued: Array<Updater<SortingState>> = []
      const table = makeTable({
        state: { sorting: [] },
        onSortingChange: (updater) => queued.push(updater),
      })

      table_setSorting(table, [{ id: 'firstName', desc: false }])
      table_resetSorting(table, true)

      expect(queued).toHaveLength(2)
      const result = queued.reduce<SortingState>(
        (state, updater) => functionalUpdate(updater, state),
        [],
      )
      expect(result).toEqual([])
    })
  })

  describe('with atom-backed state owners', () => {
    it('should keep the controlled fallback composable before ownership release', () => {
      const table = makeTable({ state: { sorting: [] } })

      table_setSorting(table, [{ id: 'firstName', desc: false }])
      table_resetSorting(table, true)

      expect(table.baseAtoms.sorting.get()).toEqual([])

      table.setOptions((old) => ({ ...old, state: undefined }))
      expect(table.atoms.sorting.get()).toEqual([])
    })

    it('should resolve external-atom updaters once and preserve no-op identity', () => {
      const sortingAtom = createAtom<SortingState>([
        { id: 'firstName', desc: false },
      ])
      const table = makeTable({ atoms: { sorting: sortingAtom } })
      const before = sortingAtom.get()
      const updater = vi.fn((): SortingState => [
        { id: 'firstName', desc: false },
      ])

      table_setSorting(table, updater)

      expect(updater).toHaveBeenCalledTimes(1)
      expect(sortingAtom.get()).toBe(before)
    })
  })

  describe('direct calls', () => {
    it('should do nothing when no change handler exists for the key', () => {
      const table = makeTable()

      expect(() =>
        setStateSlice(table as any, 'nonexistentSlice', 'value'),
      ).not.toThrow()
    })

    it('should pass the original updater through when no equality policy is supplied', () => {
      const onCustomChange = vi.fn()
      const updater = (old: number) => old + 1

      setStateSlice({ options: { onCustomChange } }, 'custom' as any, updater)

      expect(onCustomChange).toHaveBeenCalledWith(updater)
    })
  })
})
