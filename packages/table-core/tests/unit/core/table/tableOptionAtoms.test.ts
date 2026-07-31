import { describe, expect, it, vi } from 'vitest'
import { constructTable } from '../../../../src'
import { testFeatures } from '../../../fixtures/features'

function makeTable(extraOptions: Record<PropertyKey, unknown> = {}) {
  return constructTable({
    features: testFeatures({}),
    columns: [],
    data: [],
    ...extraOptions,
  } as any) as any
}

describe('table option atoms', () => {
  it('types table.options readonly and ordinary option atoms writable', () => {
    const table = constructTable({
      features: testFeatures({}),
      columns: [],
      data: [],
    })

    const assertOptionTypes = () => {
      table.optionAtoms.data.set([])
      // @ts-expect-error table.options is a readonly projection
      table.options.data = []
      // @ts-expect-error construction-only atoms are readonly
      table.optionAtoms.features.set(testFeatures({}))
      // @ts-expect-error construction-only atoms are readonly
      table.optionAtoms.atoms?.set({})
      // @ts-expect-error construction-only atoms are readonly
      table.optionAtoms.initialState?.set({})
      // @ts-expect-error aggregate snapshot version is readonly
      table.optionAtoms.snapshotVersion.set(1)
    }

    expect(assertOptionTypes).toBeTypeOf('function')
    expect(table.options.data).toEqual([])
  })

  it('keeps one readonly live options projection', () => {
    const table = makeTable({ customOption: 'initial' })
    const savedOptions = table.options
    const nextData = [{ id: 1 }]

    table.setOptions((previous: any) => ({
      ...previous,
      customOption: 'updated',
      data: nextData,
    }))

    expect(table.options).toBe(savedOptions)
    expect(savedOptions.customOption).toBe('updated')
    expect(savedOptions.data).toBe(nextData)
    expect(table.optionsStore).toBeUndefined()
  })

  it('updates writable option atoms and suppresses unrelated notifications', () => {
    const table = makeTable({ customOption: 'initial' })
    const listener = vi.fn()
    const subscription = table.optionAtoms.data.subscribe(listener)
    const nextData = [{ id: 1 }]

    expect(table.optionAtoms.data.get()).toBe(table.options.data)

    table.optionAtoms.customOption.set('updated')
    expect(table.options.customOption).toBe('updated')
    expect(listener).not.toHaveBeenCalled()

    table.optionAtoms.data.set(nextData)
    expect(table.options.data).toBe(nextData)
    expect(listener).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenLastCalledWith(nextData)

    subscription.unsubscribe()
  })

  it('creates a missing atom when setOptions introduces its option', () => {
    const table = makeTable()

    expect(table.optionAtoms.customOption).toBeUndefined()
    expect(table.options.customOption).toBeUndefined()

    table.setOptions((previous: any) => ({
      ...previous,
      customOption: 'created',
    }))

    expect(table.optionAtoms.customOption.get()).toBe('created')
    expect(table.options.customOption).toBe('created')
  })

  it('leaves omitted options unchanged and clears them with undefined', () => {
    const table = makeTable({
      customOption: 'initial',
      mergeOptions: (_current: unknown, next: unknown) => next,
    })

    table.setOptions(() => ({ data: [] }))

    expect(table.options.customOption).toBe('initial')
    expect(table.optionAtoms.customOption.get()).toBe('initial')

    table.setOptions(() => ({ customOption: undefined }))

    expect(table.options.customOption).toBeUndefined()
    expect(table.optionAtoms.customOption.get()).toBeUndefined()
  })

  it('keeps optionAtoms as a plain object and only proxies table.options', () => {
    const symbolOption = Symbol('symbolOption')
    const table = makeTable()

    table.setOptions((previous: any) => ({
      ...previous,
      customOption: 'custom',
      [symbolOption]: 'symbol',
    }))

    expect(Object.getPrototypeOf(table.optionAtoms)).toBeNull()
    expect(Reflect.ownKeys(table.options)).toEqual(
      expect.arrayContaining(['customOption', symbolOption]),
    )
    expect(
      Object.getOwnPropertyDescriptor(table.options, 'customOption'),
    ).toMatchObject({
      configurable: true,
      enumerable: true,
      value: 'custom',
      writable: false,
    })
    expect(table.options[symbolOption]).toBe('symbol')
    expect(table.optionAtoms[symbolOption].get()).toBe('symbol')
  })

  it('rejects writes through table.options', () => {
    const table = makeTable()

    expect(Reflect.set(table.options, 'data', [{ id: 1 }])).toBe(false)
    expect(Reflect.deleteProperty(table.options, 'data')).toBe(false)
    expect(
      Reflect.defineProperty(table.options, 'data', {
        configurable: true,
        value: [{ id: 1 }],
      }),
    ).toBe(false)
    expect(Reflect.preventExtensions(table.options)).toBe(false)
    expect(Reflect.setPrototypeOf(table.options, {})).toBe(false)
    expect(table.options.data).toEqual([])
  })

  it('stores callback-valued options without invoking them', () => {
    const callback = vi.fn(() => 'callback result')
    const nextCallback = vi.fn(() => 'next callback result')
    const table = makeTable({ callbackOption: callback })

    expect(callback).not.toHaveBeenCalled()
    expect(table.options.callbackOption).toBe(callback)

    // Function-valued atoms use the normal Atom updater contract. Wrapping
    // returns the callback as a value instead of executing it as an updater.
    table.optionAtoms.callbackOption.set(() => nextCallback)

    expect(table.options.callbackOption).toBe(nextCallback)
    expect(callback).not.toHaveBeenCalled()
    expect(nextCallback).not.toHaveBeenCalled()
  })

  it('publishes multi-option updates atomically through the binding batch', () => {
    const table = makeTable({
      firstOption: 'first-before',
      secondOption: 'second-before',
    })
    const combined = table._reactivity.createReadonlyAtom(
      () =>
        `${table.optionAtoms.firstOption.get()}:${table.optionAtoms.secondOption.get()}`,
      {
        debugName: 'table/options/combined-test',
      },
    )
    const observations: Array<string> = []
    const versions: Array<number> = []
    const subscription = combined.subscribe((value: string) => {
      observations.push(value)
    })
    const versionSubscription = table.optionAtoms.snapshotVersion.subscribe(
      (version: number) => {
        versions.push(version)
      },
    )

    expect(table.optionAtoms.snapshotVersion.get()).toBe(0)

    table.setOptions((previous: any) => ({
      ...previous,
      firstOption: 'first-after',
      secondOption: 'second-after',
    }))

    expect(observations).toEqual(['first-after:second-after'])
    expect(table.optionAtoms.snapshotVersion.get()).toBe(1)
    expect(versions).toEqual([1])

    table.setOptions((previous: any) => ({ ...previous }))

    expect(table.optionAtoms.snapshotVersion.get()).toBe(1)
    expect(versions).toEqual([1])

    subscription.unsubscribe()
    versionSubscription.unsubscribe()
  })
})
