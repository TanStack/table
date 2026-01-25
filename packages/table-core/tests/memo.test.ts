import { describe, it, expect, vi, afterEach } from 'vitest'
import { memo } from '../src/utils'

describe('memo', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not call Date.now() when debug is disabled', () => {
    const dateSpy = vi.spyOn(Date, 'now')
    const fn = vi.fn((a: number) => a * 2)
    const getDeps = (a: number) => [a]
    
    // Test case 1: debug returns false
    const memoizedFalse = memo(getDeps, fn, {
      key: 'test',
      debug: () => false,
    })
    memoizedFalse(1)
    expect(fn).toHaveBeenCalled()
    expect(dateSpy).toHaveBeenCalledTimes(0)
  })

  it('should not call Date.now() when debug option is missing', () => {
    const dateSpy = vi.spyOn(Date, 'now')
    const fn = vi.fn((a: number) => a * 2)
    const getDeps = (a: number) => [a]
    
    // Test case 2: no debug option
    const memoizedNoDebug = memo(getDeps, fn, {
      key: 'test',
    })
    memoizedNoDebug(1)
    expect(dateSpy).toHaveBeenCalledTimes(0)
  })

  it('should call Date.now() when debug is enabled', () => {
    const dateSpy = vi.spyOn(Date, 'now')
    const fn = vi.fn((a: number) => a * 2)
    const getDeps = (a: number) => [a]
    
    // Test case 3: debug returns true
    const memoizedTrue = memo(getDeps, fn, {
      key: 'test',
      debug: () => true,
    })
    memoizedTrue(1)
    expect(dateSpy).toHaveBeenCalled()
    // It calls calling Date.now() multiple times in the debug logic (start, end, etc)
    expect(dateSpy.mock.calls.length).toBeGreaterThan(0)
  })
})
