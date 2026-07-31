import { createRoot } from 'solid-js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTableStore } from '../src/useTableStore'
import type { Readable } from '@tanstack/solid-store'

describe('useTableStore scheduling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('coalesces snapshots and applies only the latest value', () => {
    let listener: ((snapshot: number) => void) | undefined
    const unsubscribe = vi.fn()
    const store = {
      get: () => 0,
      subscribe: (nextListener) => {
        listener =
          typeof nextListener === 'function' ? nextListener : nextListener.next
        return { unsubscribe }
      },
    } satisfies Readable<number>

    let dispose = () => {}
    const value = createRoot((disposeRoot) => {
      dispose = disposeRoot
      return useTableStore(() => store)
    })

    expect(value()).toBe(0)

    listener?.(1)
    listener?.(2)
    listener?.(3)

    expect(value()).toBe(0)

    vi.runAllTimers()

    expect(value()).toBe(3)

    dispose()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('cancels a queued update when its owner is disposed', () => {
    let listener: ((snapshot: number) => void) | undefined
    const store = {
      get: () => 0,
      subscribe: (nextListener) => {
        listener =
          typeof nextListener === 'function' ? nextListener : nextListener.next
        return { unsubscribe: vi.fn() }
      },
    } satisfies Readable<number>

    let dispose = () => {}
    const value = createRoot((disposeRoot) => {
      dispose = disposeRoot
      return useTableStore(() => store)
    })

    listener?.(1)
    dispose()
    vi.runAllTimers()

    expect(value()).toBe(0)
  })

  it('uses requestIdleCallback when the browser provides it', () => {
    const requestIdleCallback = vi
      .fn<(callback: IdleRequestCallback) => number>()
      .mockImplementation((callback) => {
        callback({
          didTimeout: false,
          timeRemaining: () => 10,
        })
        return 1
      })

    vi.stubGlobal('requestIdleCallback', requestIdleCallback)
    vi.stubGlobal('cancelIdleCallback', vi.fn())

    let listener: ((snapshot: number) => void) | undefined
    const store = {
      get: () => 0,
      subscribe: (nextListener) => {
        listener =
          typeof nextListener === 'function' ? nextListener : nextListener.next
        return { unsubscribe: vi.fn() }
      },
    } satisfies Readable<number>

    let dispose = () => {}
    const value = createRoot((disposeRoot) => {
      dispose = disposeRoot
      return useTableStore(() => store)
    })

    listener?.(1)
    vi.advanceTimersByTime(32)

    expect(requestIdleCallback).toHaveBeenCalledTimes(1)
    expect(value()).toBe(1)

    dispose()
  })
})
