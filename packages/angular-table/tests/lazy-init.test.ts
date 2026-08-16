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
import { injectLazyInit } from '../src/injectLazyInit'
import { flushQueue, setFixtureSignalInputs } from './test-utils'
import type { WritableSignal } from '@angular/core'

describe('injectLazyInit', () => {
  test('should register cleanup only after initialization', () => {
    const initializedObject = { data: signal(true) }
    const initializer = vi.fn(() => initializedObject)
    const cleanup = vi.fn<(object: typeof initializedObject) => void>()

    @Component({ standalone: true, template: `` })
    class Test {
      readonly lazySignal = injectLazyInit(initializer, cleanup)
    }

    const uninitializedFixture = TestBed.createComponent(Test)
    uninitializedFixture.destroy()

    expect(initializer).not.toHaveBeenCalled()
    expect(cleanup).not.toHaveBeenCalled()

    const initializedFixture = TestBed.createComponent(Test)
    initializedFixture.componentInstance.lazySignal.data()
    initializedFixture.destroy()

    expect(initializer).toHaveBeenCalledOnce()
    expect(cleanup).toHaveBeenCalledOnce()
    expect(cleanup).toHaveBeenCalledWith(initializedObject)
  })

  test('should not initialize until accessed', () => {
    const mockFn = vi.fn()

    TestBed.runInInjectionContext(() => {
      const proxy = injectLazyInit(() => {
        mockFn()
        return {
          data: signal(true),
        }
      }, vi.fn())

      expect(mockFn).not.toHaveBeenCalled()

      TestBed.tick()

      expect(mockFn).not.toHaveBeenCalled()

      proxy.data()

      expect(mockFn).toHaveBeenCalledOnce()
    })
  })

  test('should init eagerly accessing manually', () => {
    const mockFn = vi.fn()

    TestBed.runInInjectionContext(() => {
      const lazySignal = injectLazyInit(() => {
        mockFn()
        return {
          data: signal(true),
        }
      }, vi.fn())

      lazySignal.data()
    })

    expect(mockFn).toHaveBeenCalled()
  })

  test('should init lazily and only once', async () => {
    const initCallFn = vi.fn()
    const registerDataValue = vi.fn<(arg0: number) => void>()

    let value!: { data: WritableSignal<number> }
    const outerSignal = signal(0)

    TestBed.runInInjectionContext(() => {
      value = injectLazyInit(() => {
        initCallFn()

        void outerSignal()

        return { data: signal(0) }
      }, vi.fn())

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
      template: `{{ call() }} - {{ lazySignal.data() }}`,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class Test {
      readonly title = input.required<string>()
      readonly call = signal(0)

      lazySignal = injectLazyInit(() => {
        this.call.update((value) => value + 1)
        return {
          data: computed(() => this.title()),
        }
      }, vi.fn())
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
