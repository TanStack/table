import { describe, expect, test, vi } from 'vitest'
import { tableMemo } from '../../src/utils'

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
