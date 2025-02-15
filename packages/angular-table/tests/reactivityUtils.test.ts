import { describe, expect, test, vi } from 'vitest'
import { effect, isSignal, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { defineLazyComputedProperty, toComputed } from '../src/reactivityUtils'

describe('toComputed', () => {
  describe('args = 0', () => {
    test('creates a computed', () => {
      const notifier = signal(1)

      const result = toComputed(
        notifier,
        () => {
          return notifier() * 2
        },
        'double',
      )

      expect(result.name).toEqual('double')
      expect(isSignal(result)).toEqual(true)

      TestBed.runInInjectionContext(() => {
        const mockFn = vi.fn()

        effect(() => {
          mockFn(result())
        })

        TestBed.flushEffects()
        expect(mockFn).toHaveBeenLastCalledWith(2)

        notifier.set(3)
        TestBed.flushEffects()
        expect(mockFn).toHaveBeenLastCalledWith(6)

        notifier.set(2)
        TestBed.flushEffects()
        expect(mockFn).toHaveBeenLastCalledWith(4)

        expect(mockFn.mock.calls.length).toEqual(3)
      })
    })
  })

  describe('args >= 1', () => {
    test('creates a fn an explicit first argument and allows other args', () => {
      const notifier = signal(1)

      const fn1 = toComputed(
        notifier,
        (arg0: number, arg1: string, arg3?: number) => {
          return { arg0, arg1, arg3 }
        },
        '3args',
      )
      expect(fn1.length).toEqual(1)

      // currently full rest parameters is not supported
      const fn2 = toComputed(
        notifier,
        function myFn(...args: Array<any>) {
          return args
        },
        '3args',
      )
      expect(fn2.length).toEqual(0)
    })

    test('reuse created computed when args are the same', () => {
      const notifier = signal(1)

      const invokeMock = vi.fn()

      const sum = toComputed(
        notifier,
        (arg0: number, arg1?: string) => {
          invokeMock(arg0)
          return notifier() + arg0
        },
        'sum',
      )

      sum(1)
      sum(3)
      sum(2)
      sum(1)
      sum(1)
      sum(2)
      sum(3)

      expect(invokeMock).toHaveBeenCalledTimes(3)
      expect(invokeMock).toHaveBeenNthCalledWith(1, 1)
      expect(invokeMock).toHaveBeenNthCalledWith(2, 3)
      expect(invokeMock).toHaveBeenNthCalledWith(3, 2)
    })

    test('cached computed are reactive', () => {
      const invokeMock = vi.fn()
      const notifier = signal(1)

      const sum = toComputed(
        notifier,
        (arg0: number) => {
          invokeMock(arg0)
          return notifier() + arg0
        },
        'sum',
      )

      TestBed.runInInjectionContext(() => {
        const mockSumBy3Fn = vi.fn()
        const mockSumBy2Fn = vi.fn()

        effect(() => {
          mockSumBy3Fn(sum(3))
        })
        effect(() => {
          mockSumBy2Fn(sum(2))
        })

        TestBed.flushEffects()
        expect(mockSumBy3Fn).toHaveBeenLastCalledWith(4)
        expect(mockSumBy2Fn).toHaveBeenLastCalledWith(3)

        notifier.set(2)
        TestBed.flushEffects()
        expect(mockSumBy3Fn).toHaveBeenLastCalledWith(5)
        expect(mockSumBy2Fn).toHaveBeenLastCalledWith(4)

        expect(mockSumBy3Fn.mock.calls.length).toEqual(2)
        expect(mockSumBy2Fn.mock.calls.length).toEqual(2)
      })

      for (let i = 0; i < 4; i++) {
        sum(3)
        sum(2)
      }
      // invoked every time notifier change
      expect(invokeMock).toHaveBeenCalledTimes(4)
    })
  })

  describe('args 0~1', () => {
    test('creates a fn an explicit first argument and allows other args', () => {
      const notifier = signal(1)

      const fn1 = toComputed(
        notifier,
        (arg0?: number) => {
          if (arg0 === undefined) {
            return 5 * notifier()
          }
          return arg0 * notifier()
        },
        'optionalArgs',
      )
      expect(fn1.length).toEqual(1)

      fn1();

    })
  })
})

describe('defineLazyComputedProperty', () => {
  test('define a computed property and cache the result after first access', () => {
    const notifier = signal(1)
    const originalObject = {} as any
    const mockValueFn = vi.fn(() => 2)

    defineLazyComputedProperty(notifier, {
      originalObject,
      property: 'computedProp',
      valueFn: mockValueFn,
    })

    let propDescriptor = Object.getOwnPropertyDescriptor(
      originalObject,
      'computedProp',
    )
    expect(propDescriptor && !!propDescriptor.get).toEqual(true)

    originalObject.computedProp

    propDescriptor = Object.getOwnPropertyDescriptor(
      originalObject,
      'computedProp',
    )
    expect(propDescriptor!.get).not.toBeDefined()
    expect(isSignal(propDescriptor!.value))
  })
})
