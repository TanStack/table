import { createAtom } from '@tanstack/store'
import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  callMemoOrStaticFn,
  cloneState,
  copyInstancePropertiesWithoutMemos,
  flattenBy,
  functionalUpdate,
  getFunctionNameInfo,
  isFunction,
  tableMemo,
} from '../../src/utils'

describe('tableMemo', () => {
  function createMemoTable(
    overrides: Record<string, unknown> = {},
    options: Record<string, unknown> = {},
  ) {
    return {
      _reactivity: {
        addSubscription: vi.fn(),
        batch: (fn: () => void) => fn(),
        createReadonlyAtom: (
          fn: () => unknown,
          atomOptions?: {
            compare?: (previous: unknown, next: unknown) => boolean
          },
        ) =>
          createAtom(fn, {
            compare: atomOptions?.compare,
          }),
        createWritableAtom: (value: unknown) => createAtom(value),
        schedule: vi.fn((fn: () => void) => fn()),
        untrack: (fn: () => unknown) => fn(),
        wrapExternalAtoms: false,
        ...overrides,
      },
      options,
      store: { state: {} },
    } as any
  }

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  test('is lazy and evaluates exactly once on the first read with an eager computed binding', () => {
    const compute = vi.fn(() => 42)
    const onAfterUpdate = vi.fn()
    const schedule = vi.fn((fn: () => void) => fn())
    const createReadonlyAtom = vi.fn((fn: () => number) => {
      const value = fn()
      return {
        get: () => value,
        subscribe: vi.fn(),
      }
    })
    const table = createMemoTable({ createReadonlyAtom, schedule })
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: compute,
      onAfterUpdate,
    })

    expect(createReadonlyAtom).not.toHaveBeenCalled()
    expect(compute).not.toHaveBeenCalled()
    expect(schedule).not.toHaveBeenCalled()

    expect(memoized()).toBe(42)
    expect(createReadonlyAtom).toHaveBeenCalledOnce()
    expect(compute).toHaveBeenCalledOnce()
    expect(schedule).toHaveBeenCalledOnce()
    expect(onAfterUpdate).toHaveBeenCalledOnce()
  })

  test('uses the native computed cache for repeated reads', () => {
    const source = createAtom(1)
    const compute = vi.fn(() => source.get() * 2)
    const onAfterUpdate = vi.fn()
    const table = createMemoTable()
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: compute,
      onAfterUpdate,
    })

    expect(memoized()).toBe(2)
    expect(memoized()).toBe(2)
    expect(compute).toHaveBeenCalledOnce()
    expect(onAfterUpdate).toHaveBeenCalledOnce()
  })

  test('reevaluates after a native dependency changes', () => {
    const source = createAtom(1)
    const compute = vi.fn(() => source.get() * 2)
    const onAfterUpdate = vi.fn()
    const table = createMemoTable()
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: compute,
      onAfterUpdate,
    })

    expect(memoized()).toBe(2)
    source.set(2)
    expect(memoized()).toBe(4)
    expect(compute).toHaveBeenCalledTimes(2)
    expect(onAfterUpdate).toHaveBeenCalledTimes(2)
  })

  test('schedules after every successful evaluation even when comparison retains the previous result', () => {
    const source = createAtom(1)
    const compute = vi.fn(() => ({ parity: source.get() % 2 }))
    const onAfterUpdate = vi.fn()
    const table = createMemoTable()
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: compute,
      compare: (previous, next) => previous.parity === next.parity,
      onAfterUpdate,
    })

    const first = memoized()
    source.set(3)
    const second = memoized()

    expect(second).toBe(first)
    expect(compute).toHaveBeenCalledTimes(2)
    expect(onAfterUpdate).toHaveBeenCalledTimes(2)
  })

  test('applies the result comparator exactly once per reevaluation', () => {
    const source = createAtom(1)
    const compare = vi.fn(
      (previous: { parity: number }, next: { parity: number }) =>
        previous.parity === next.parity,
    )
    const table = createMemoTable()
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: () => ({ parity: source.get() % 2 }),
      compare,
    })

    memoized()
    source.set(3)
    memoized()

    expect(compare).toHaveBeenCalledOnce()
  })

  test('does not advance or schedule when result comparison throws', () => {
    const source = createAtom(1)
    const onAfterUpdate = vi.fn()
    const schedule = vi.fn((fn: () => void) => fn())
    const compare = vi
      .fn<(previous: number, next: number) => boolean>()
      .mockImplementationOnce(() => {
        throw new Error('comparison failed')
      })
      .mockReturnValue(false)
    const table = createMemoTable({ schedule })
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: () => source.get(),
      compare,
      onAfterUpdate,
    })

    expect(memoized()).toBe(1)
    source.set(2)
    expect(() => memoized()).toThrow('comparison failed')
    expect(schedule).toHaveBeenCalledOnce()
    expect(onAfterUpdate).toHaveBeenCalledOnce()

    expect(memoized()).toBe(2)
    expect(schedule).toHaveBeenCalledTimes(2)
    expect(onAfterUpdate).toHaveBeenCalledTimes(2)
  })

  test('does not advance or schedule when the computation throws', () => {
    const source = createAtom(0)
    const onAfterUpdate = vi.fn()
    const schedule = vi.fn((fn: () => void) => fn())
    const table = createMemoTable({ schedule })
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: () => {
        source.get()
        throw new Error('no value')
      },
      onAfterUpdate,
    })

    expect(() => memoized()).toThrow('no value')
    expect(schedule).not.toHaveBeenCalled()
    expect(onAfterUpdate).not.toHaveBeenCalled()
  })

  test('does not schedule after-update work when no callback is provided', () => {
    const schedule = vi.fn()
    const table = createMemoTable({ schedule })
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: () => 1,
    })

    expect(memoized()).toBe(1)
    expect(memoized()).toBe(1)
    expect(schedule).not.toHaveBeenCalled()
  })

  test('schedules the untracked callback after returning the computed result', () => {
    const scheduled: Array<() => void> = []
    const events: Array<string> = []
    const schedule = vi.fn((fn: () => void) => {
      events.push('schedule')
      scheduled.push(fn)
    })
    const untrack = vi.fn((fn: () => void) => {
      events.push('untrack')
      return fn()
    })
    const onAfterUpdate = vi.fn(() => {
      events.push('after')
    })
    const table = createMemoTable({ schedule, untrack })
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: () => {
        events.push('compute')
        return 1
      },
      onAfterUpdate,
    })

    expect(memoized()).toBe(1)
    events.push('returned')
    expect(events).toEqual(['compute', 'schedule', 'returned'])
    expect(onAfterUpdate).not.toHaveBeenCalled()

    scheduled[0]!()
    expect(events).toEqual([
      'compute',
      'schedule',
      'returned',
      'untrack',
      'after',
    ])
  })

  test('logs cache hits when debugCache is enabled', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const groupCollapsed = vi
      .spyOn(console, 'groupCollapsed')
      .mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'trace').mockImplementation(() => {})
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {})
    const table = createMemoTable({}, { debugCache: true })
    const memoized = tableMemo({
      table,
      fnName: 'table.getValue',
      fn: () => 1,
    })

    memoized()
    memoized()

    expect(groupCollapsed).toHaveBeenCalledOnce()
    expect(groupCollapsed.mock.calls[0]?.[0]).toContain('(cache)')
  })
})

describe('functionalUpdate', () => {
  test('returns plain values as-is', () => {
    expect(functionalUpdate(5, 1)).toBe(5)
  })

  test('applies functional updaters to the input', () => {
    expect(functionalUpdate((old: number) => old + 1, 1)).toBe(2)
  })
})

describe('isFunction', () => {
  test('detects functions', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction({})).toBe(false)
    expect(isFunction(null)).toBe(false)
    expect(isFunction('fn')).toBe(false)
  })
})

describe('flattenBy', () => {
  test('flattens a tree depth-first', () => {
    type Node = { id: string; children: Array<Node> }
    const tree: Array<Node> = [
      {
        id: 'a',
        children: [
          { id: 'a1', children: [{ id: 'a1x', children: [] }] },
          { id: 'a2', children: [] },
        ],
      },
      { id: 'b', children: [] },
    ]

    expect(flattenBy(tree, (node) => node.children).map((n) => n.id)).toEqual([
      'a',
      'a1',
      'a1x',
      'a2',
      'b',
    ])
  })
})

describe('cloneState', () => {
  test('deep clones plain objects and arrays', () => {
    const state = { sorting: [{ id: 'a', desc: false }], nested: { x: 1 } }
    const cloned = cloneState(state)

    expect(cloned).toEqual(state)
    expect(cloned).not.toBe(state)
    expect(cloned.sorting).not.toBe(state.sorting)
    expect(cloned.sorting[0]).not.toBe(state.sorting[0])
    expect(cloned.nested).not.toBe(state.nested)
  })

  test('preserves non-plain objects by reference', () => {
    const date = new Date()
    const atomLike = new (class {
      value = 1
    })()
    const state = { date, atomLike }
    const cloned = cloneState(state)

    expect(cloned.date).toBe(date)
    expect(cloned.atomLike).toBe(atomLike)
  })

  test('passes primitives through', () => {
    expect(cloneState(5)).toBe(5)
    expect(cloneState('x')).toBe('x')
    expect(cloneState(undefined)).toBeUndefined()
  })
})

describe('copyInstancePropertiesWithoutMemos', () => {
  test('copies own properties but skips memo closures and the cells cache', () => {
    const source = {
      id: '0',
      depth: 1,
      _memo_getAllCells: () => {},
      _cellsCache: new WeakMap(),
    }
    const target: Record<string, unknown> = {}

    copyInstancePropertiesWithoutMemos(target, source)

    expect(target['id']).toBe('0')
    expect(target['depth']).toBe(1)
    expect(target['_memo_getAllCells']).toBeUndefined()
    expect(target['_cellsCache']).toBeUndefined()
  })
})

describe('getFunctionNameInfo', () => {
  test('splits static function names on underscores by default', () => {
    expect(getFunctionNameInfo('table_getRow')).toEqual({
      parentName: 'table',
      fnKey: 'getRow',
      fnName: 'table.getRow',
    })
  })

  test('supports dot-separated names', () => {
    expect(getFunctionNameInfo('column.getSize', '.')).toEqual({
      parentName: 'column',
      fnKey: 'getSize',
      fnName: 'column.getSize',
    })
  })
})

describe('callMemoOrStaticFn', () => {
  test('prefers the instance method when present', () => {
    const staticFn = vi.fn(() => 'static')
    const obj = { getThing: vi.fn(() => 'memoized') }

    expect(callMemoOrStaticFn(obj, 'getThing', staticFn)).toBe('memoized')
    expect(staticFn).not.toHaveBeenCalled()
  })

  test('falls back to the static fn with the object as first argument', () => {
    const staticFn = vi.fn((_obj: object, suffix: string) => `static-${suffix}`)
    const obj = {}

    expect(callMemoOrStaticFn(obj, 'getThing', staticFn, 'x')).toBe('static-x')
    expect(staticFn).toHaveBeenCalledWith(obj, 'x')
  })
})
