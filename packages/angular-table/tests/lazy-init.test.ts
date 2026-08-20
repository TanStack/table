import { describe, expect, test, vi } from 'vitest'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { lazyInit } from '../src/lazySignalInitializer'
import { flushQueue, setFixtureSignalInputs } from './test-utils'
import type { WritableSignal } from '@angular/core'

describe('lazyInit', () => {
  test('should init lazily in next tick when not accessing manually', () => {
    const mockFn = vi.fn()

    TestBed.runInInjectionContext(() => {
      const proxy = lazyInit(() => {
        mockFn()
        return {
          data: signal(true),
        }
      })

      expect(mockFn).not.toHaveBeenCalled()
      expect(proxy.initialized).toEqual(false)
      expect(proxy.rawValue).toBeNullable()

      TestBed.tick()

      expect(proxy.initialized).toEqual(true)
      expect(proxy.rawValue).not.toBeNullable()
      expect(mockFn).toHaveBeenCalled()
    })
  })

  test('should init eagerly accessing manually', () => {
    const mockFn = vi.fn()

    TestBed.runInInjectionContext(() => {
      const lazySignal = lazyInit(() => {
        mockFn()
        return {
          data: signal(true),
        }
      })

      lazySignal.value.data()
    })

    expect(mockFn).toHaveBeenCalled()
  })

  test('should init lazily and only once', async () => {
    const initCallFn = vi.fn()
    const registerDataValue = vi.fn<(arg0: number) => void>()

    let value!: { data: WritableSignal<number> }
    const outerSignal = signal(0)

    TestBed.runInInjectionContext(() => {
      value = lazyInit(() => {
        initCallFn()

        void outerSignal()

        return { data: signal(0) }
      }).value

      effect(() => registerDataValue(value.data()))
    })

    value.data()

    TestBed.tick()

    expect(outerSignal).toBeDefined()

    expect(initCallFn).toHaveBeenCalledTimes(1)

    outerSignal.set(1)
    await flushQueue()
    outerSignal.set(2)
    await flushQueue()
    value.data.set(4)
    await flushQueue()

    expect(initCallFn).toHaveBeenCalledTimes(1)
    expect(registerDataValue).toHaveBeenCalledTimes(1)
  })

  test('should support required signal input', async () => {
    @Component({
      standalone: true,
      template: `{{ call }} - {{ lazySignal.data() }}`,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class Test {
      readonly title = input.required<string>()
      call = 0

      lazySignal = lazyInit(() => {
        this.call++
        return {
          data: computed(() => this.title()),
        }
      }).value
    }

    const fixture = TestBed.createComponent(Test)
    setFixtureSignalInputs(fixture, { title: 'newValue' })
    expect(fixture.debugElement.nativeElement.textContent).toBe('1 - newValue')
    await flushQueue()

    setFixtureSignalInputs(fixture, { title: 'updatedValue' })
    expect(fixture.debugElement.nativeElement.textContent).toBe(
      '1 - updatedValue',
    )

    setFixtureSignalInputs(fixture, { title: 'newUpdatedValue' })
    expect(fixture.debugElement.nativeElement.textContent).toBe(
      '1 - newUpdatedValue',
    )
  })
})
