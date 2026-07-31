import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { TableReactivityBindings } from '../reactivity/coreReactivityFeature.types'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { TableOptions } from '../../types/TableOptions'
import type {
  TableOptionAtoms,
  TableOptionsLive,
} from './coreTablesFeature.types'

type OptionKey = string | symbol
type ValueBox = { value: unknown }

interface TableOptionAtomsInternals {
  readonly options: unknown
  apply: (options: unknown) => number | undefined
}

const constructStaticOptionKeys = new Set<PropertyKey>([
  'features',
  'atoms',
  'initialState',
])
const snapshotVersionKey = 'snapshotVersion'
const optionAtomsInternals = new WeakMap<object, TableOptionAtomsInternals>()

/**
 * Creates one stable atom for each resolved option and a readonly live view.
 *
 * Values are boxed so callback-valued options are never interpreted as
 * computed functions or atom updaters during initialization.
 */
export function createTableOptionAtoms<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  initialOptions: TableOptions<TFeatures, TData>,
  reactivity: TableReactivityBindings,
  setOption: (key: OptionKey, updater: Updater<unknown>) => void,
): TableOptionAtoms<TFeatures, TData> {
  const optionAtoms = Object.create(null) as Record<
    PropertyKey,
    Atom<unknown> | ReadonlyAtom<unknown>
  >
  const optionsTarget = Object.create(null) as Record<PropertyKey, unknown>
  const valueAtoms = new Map<OptionKey, Atom<ValueBox>>()
  const snapshotVersionSource = reactivity.createWritableAtom(0, {
    debugName: 'table/optionAtoms/snapshotVersion',
    mode: 'staged',
  })

  Object.defineProperty(optionAtoms, snapshotVersionKey, {
    configurable: false,
    enumerable: true,
    value: {
      get: () => snapshotVersionSource.get(),
      subscribe: snapshotVersionSource.subscribe.bind(snapshotVersionSource),
    } satisfies ReadonlyAtom<number>,
    writable: false,
  })

  const setValue = (
    key: OptionKey,
    value: unknown,
  ): boolean => {
    if (key === snapshotVersionKey) {
      throw new Error(
        `Table option "${snapshotVersionKey}" is reserved by table.optionAtoms`,
      )
    }

    const valueAtom = valueAtoms.get(key)
    if (valueAtom) {
      if (Object.is(valueAtom.get().value, value)) {
        return false
      }

      valueAtom.set({ value })
      return true
    }

    const newValueAtom = reactivity.createWritableAtom<ValueBox>(
      { value },
      {
        debugName: `table/optionAtoms/${String(key)}`,
        mode: 'staged',
      },
    )
    const readonlyAtom = reactivity.createReadonlyAtom(
      () => newValueAtom.get().value,
      {
        debugName: `table/options/${String(key)}`,
      },
    )
    const publicAtom = constructStaticOptionKeys.has(key)
      ? readonlyAtom
      : ({
          get: () => readonlyAtom.get(),
          subscribe: readonlyAtom.subscribe.bind(readonlyAtom),
          set: (updater: Updater<unknown>) => setOption(key, updater),
        } satisfies Atom<unknown>)

    valueAtoms.set(key, newValueAtom)
    Object.defineProperty(optionAtoms, key, {
      configurable: true,
      enumerable: true,
      value: publicAtom,
      writable: false,
    })
    Object.defineProperty(optionsTarget, key, {
      configurable: true,
      enumerable: true,
      get: () => optionAtoms[key]!.get(),
    })

    return true
  }

  for (const key of Reflect.ownKeys(initialOptions)) {
    setValue(key, Reflect.get(initialOptions, key, initialOptions))
  }

  const rejectMutation = () => false
  const options = new Proxy(optionsTarget, {
    getOwnPropertyDescriptor: (target, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, key)
      return descriptor
        ? {
            configurable: true,
            enumerable: true,
            value: Reflect.get(target, key, target),
            writable: false,
          }
        : undefined
    },
    defineProperty: rejectMutation,
    deleteProperty: rejectMutation,
    preventExtensions: rejectMutation,
    set: rejectMutation,
    setPrototypeOf: rejectMutation,
  }) as TableOptionsLive<TFeatures, TData>

  const apply = (nextOptions: TableOptions<TFeatures, TData>) => {
    const nextKeys = Reflect.ownKeys(nextOptions)
    let changed = false
    let commitToken: number | undefined

    reactivity.batch(() => {
      for (const key of nextKeys) {
        changed =
          setValue(
            key,
            Reflect.get(nextOptions, key, nextOptions),
          ) || changed
      }

      if (changed) {
        snapshotVersionSource.set((version) => version + 1)
        commitToken = reactivity.stage?.()
      } else {
        commitToken = reactivity.getStageToken?.()
      }
    })

    return commitToken
  }

  optionAtomsInternals.set(optionAtoms, {
    options,
    apply: apply as (options: unknown) => number | undefined,
  })

  return optionAtoms as TableOptionAtoms<TFeatures, TData>
}

export function getTableOptionsFromAtoms<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  optionAtoms: TableOptionAtoms<TFeatures, TData>,
): TableOptionsLive<TFeatures, TData> {
  return optionAtomsInternals.get(optionAtoms)!
    .options as TableOptionsLive<TFeatures, TData>
}

export function applyTableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  optionAtoms: TableOptionAtoms<TFeatures, TData>,
  nextOptions: TableOptions<TFeatures, TData>,
): number | undefined {
  return optionAtomsInternals.get(optionAtoms)!.apply(nextOptions)
}
