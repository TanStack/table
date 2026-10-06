import { describe, expect, test, vi } from 'vitest'
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
  test('does not schedule after-update work when no callback is provided', () => {
    const schedule = vi.fn()
    const memoized = tableMemo({
      table: {
        options: {},
        _reactivity: {
          schedule,
          untrack: (fn: () => void) => fn(),
        },
      } as any,
      fnName: 'table.getValue',
      fn: (value?: number) => value ?? 0,
      memoDeps: (value?: number) => [value],
    })

    expect(memoized(1)).toBe(1)
    expect(memoized(2)).toBe(2)
    expect(schedule).not.toHaveBeenCalled()
  })

  test('schedules after-update work when a callback is provided', () => {
    const schedule = vi.fn((fn: () => void) => fn())
    const onAfterUpdate = vi.fn()
    const memoized = tableMemo({
      table: {
        options: {},
        _reactivity: {
          schedule,
          untrack: (fn: () => void) => fn(),
        },
      } as any,
      fnName: 'table.getValue',
      fn: (value?: number) => value ?? 0,
      memoDeps: (value?: number) => [value],
      onAfterUpdate,
    })

    expect(memoized(1)).toBe(1)
    expect(schedule).toHaveBeenCalledTimes(1)
    expect(onAfterUpdate).toHaveBeenCalledTimes(1)
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
  test('copies own properties but skips the memo holder and the cells cache', () => {
    const source = {
      id: '0',
      depth: 1,
      _memos: { getAllCells: () => {} },
      _cellsCache: new WeakMap(),
    }
    const target: Record<string, unknown> = {}

    copyInstancePropertiesWithoutMemos(target, source)

    expect(target['id']).toBe('0')
    expect(target['depth']).toBe(1)
    expect(target['_memos']).toBeUndefined()
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
