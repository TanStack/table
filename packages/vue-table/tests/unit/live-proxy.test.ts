import { describe, expect, test } from 'vitest'
import { createLiveProxy } from '../../src/live-proxy'

type Target = { custom?: string; label: string }

describe('createLiveProxy', () => {
  test('delete removes the property from the current target', () => {
    const target: Target = { custom: 'old', label: 'a' }
    const context = createLiveProxy(() => target)

    expect(delete context.custom).toBe(true)
    expect(Object.hasOwn(target, 'custom')).toBe(false)
    expect('custom' in context).toBe(false)
    expect(context.custom).toBeUndefined()
  })

  test('defineProperty defines the property on the current target', () => {
    const target: Target = { label: 'a' }
    const context = createLiveProxy(() => target)

    Object.defineProperty(context, 'custom', { value: 'new' })

    expect(target.custom).toBe('new')
    expect(context.custom).toBe('new')
  })

  test('defineProperty updates an existing configurable property', () => {
    const target: Target = { custom: 'old', label: 'a' }
    const context = createLiveProxy(() => target)

    Object.defineProperty(context, 'custom', {
      value: 'new',
      configurable: true,
      enumerable: true,
      writable: true,
    })

    expect(target.custom).toBe('new')
    expect(context.custom).toBe('new')
  })

  test('rejects explicitly non-configurable definitions without touching the target', () => {
    const target: Target = { label: 'a' }
    const context = createLiveProxy(() => target)

    expect(() =>
      Object.defineProperty(context, 'custom', {
        value: 'new',
        configurable: false,
      }),
    ).toThrow(TypeError)
    expect(Object.hasOwn(target, 'custom')).toBe(false)
  })

  test('delete and defineProperty follow target changes', () => {
    let target: Target = { custom: 'first', label: 'a' }
    const context = createLiveProxy(() => target)
    const first = target

    target = { custom: 'second', label: 'b' }
    expect(delete context.custom).toBe(true)
    expect(target.custom).toBeUndefined()
    expect(first.custom).toBe('first')

    Object.defineProperty(context, 'custom', { value: 'third' })
    expect(target.custom).toBe('third')
    expect(Object.hasOwn(first, 'custom')).toBe(true)
    expect(first.custom).toBe('first')
  })

  test('refuses preventExtensions so later definitions do not mutate the target', () => {
    const target: Target = { label: 'a' }
    const context = createLiveProxy(() => target)

    expect(() => Object.preventExtensions(context)).toThrow(TypeError)
    expect(Reflect.preventExtensions(context)).toBe(false)
    expect(Object.isExtensible(context)).toBe(true)
    expect(Object.isExtensible(target)).toBe(true)

    expect(Reflect.defineProperty(context, 'custom', { value: 'new' })).toBe(
      true,
    )
    expect(target.custom).toBe('new')
    expect(context.custom).toBe('new')
  })

  test('reads, writes, and key checks still forward to the current target', () => {
    let target: Target = { label: 'a' }
    const context = createLiveProxy(() => target)

    context.label = 'updated'
    expect(target.label).toBe('updated')

    target = { custom: 'x', label: 'b' }
    expect(context.label).toBe('b')
    expect('custom' in context).toBe(true)
    expect(Object.keys(context)).toEqual(['custom', 'label'])
  })
})
