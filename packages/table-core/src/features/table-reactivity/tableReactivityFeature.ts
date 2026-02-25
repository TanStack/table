import { setReactivePropertiesOnObject } from './tableReactivityFeature.utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Accessor } from './tableReactivityFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { Table } from '../../types/Table'

/**
 * Predicate used to skip/ignore a property name when applying Angular reactivity.
 *
 * Returning `true` means the property should NOT be wrapped/made reactive.
 */
type SkipPropertyFn = (property: string) => boolean

/**
 * Fine-grained configuration for Angular reactivity.
 *
 * Each key controls whether prototype methods/getters on the corresponding TanStack Table
 * objects are wrapped with signal-aware access.
 *
 * - `true` enables wrapping using the default skip rules.
 * - `false` disables wrapping entirely for that object type.
 * - a function allows customizing the skip rules (see {@link SkipPropertyFn}).
 *
 * @example
 * ```ts
 * const table = injectTable(() => {
 *  // ...table options,
 *  reactivity: {
 *    // fine-grained control over which table objects have reactive properties,
 *    // and which properties are wrapped
 *    header: true,
 *    column: true,
 *    row: true,
 *    cell: true,
 *  }
 * })
 * ```
 */
export interface AngularReactivityFlags {
  /** Controls reactive wrapping for `Header` instances. */
  header: boolean | SkipPropertyFn
  /** Controls reactive wrapping for `Column` instances. */
  column: boolean | SkipPropertyFn
  /** Controls reactive wrapping for `Row` instances. */
  row: boolean | SkipPropertyFn
  /** Controls reactive wrapping for `Cell` instances. */
  cell: boolean | SkipPropertyFn
}

/**
 * Table option extension for Angular reactivity.
 *
 * Available on `createTable` options via module augmentation in this file.
 */
interface TableOptions_Reactivity {
  /**
   * Enables/disables and configures Angular reactivity on table-related prototypes.
   *
   * If omitted, defaults are provided by the feature.
   */
  reactivity?: Partial<AngularReactivityFlags>
}

/**
 * Table API extension for Angular reactivity.
 *
 * Added to the table instance via module augmentation.
 */
interface Table_Reactivity<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns a table signal that updates whenever the table state or options changes.
   */
  value: Accessor<Table<TFeatures, TData>>
  /**
   * Sets the reactive notifier that powers {@link get}.
   *
   * @internal Used by the Angular table adapter to connect its notifier to the core table.
   */
  setTableNotifier: (signal: Accessor<Table<TFeatures, TData>>) => void
}

/**
 * Type map describing what this feature adds to TanStack Table constructors.
 */
interface TableReactivityFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  TableOptions: TableOptions_Reactivity
  Table: Table_Reactivity<TFeatures, TData>
}

/**
 * Resolves the user-provided `reactivity.*` config to a skip predicate.
 *
 * - `false` is handled by callers (feature method returns early)
 * - `true` selects the default predicate
 * - a function overrides the default predicate
 */
const getUserSkipPropertyFn = (
  value: undefined | null | boolean | SkipPropertyFn,
  defaultPropertyFn: SkipPropertyFn,
) => {
  if (typeof value === 'boolean') {
    return defaultPropertyFn
  }

  return value ?? defaultPropertyFn
}

export type InteroperableWritableSignal<T> = {
  (): T
  set: (value: unknown) => void
}

export interface ReactivityFeatureFactoryOptions {
  createSignal: <T>(value: T) => InteroperableWritableSignal<T>
  createMemo: <T>(accessor: Accessor<T>) => Accessor<T>
  isSignal: (v: unknown) => boolean
}

export function constructReactivityFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  factory: ReactivityFeatureFactoryOptions,
): TableFeature<TableReactivityFeatureConstructors<TFeatures, TData>> {
  const { createSignal, createMemo } = factory

  return {
    getDefaultTableOptions(table) {
      return {
        reactivity: {
          header: true,
          column: true,
          row: true,
          cell: true,
        },
      }
    },
    constructTableAPIs: (table) => {
      const rootNotifier = createSignal<Accessor<
        Table<TFeatures, TData>
      > | null>(null)

      table.setTableNotifier = (notifier) => {
        rootNotifier.set(notifier)
      }

      table.value = () => {
        const notifier = rootNotifier()
        void notifier?.()
        return table as any
      }

      setReactivePropertiesOnObject(table.value, table, {
        overridePrototype: false,
        skipProperty: skipBaseProperties,
        factory,
      })
    },

    assignCellPrototype: (prototype, table) => {
      // @ts-expect-error Internal
      if (table.options.reactivity?.cell === false) {
        return
      }
      // @ts-expect-error Internal
      setReactivePropertiesOnObject(table.value, prototype, {
        skipProperty: getUserSkipPropertyFn(
          // @ts-expect-error Internal
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
        factory,
      })
    },

    assignColumnPrototype: (prototype, table) => {
      // @ts-expect-error Internal
      if (table.options.reactivity?.column === false) {
        return
      }
      // @ts-expect-error Internal
      setReactivePropertiesOnObject(table.value, prototype, {
        skipProperty: getUserSkipPropertyFn(
          // @ts-expect-error Internal
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
        factory,
      })
    },

    assignHeaderPrototype: (prototype, table) => {
      // @ts-expect-error Internal
      if (table.options.reactivity?.header === false) {
        return
      }
      // @ts-expect-error Internal
      setReactivePropertiesOnObject(table.value, prototype, {
        skipProperty: getUserSkipPropertyFn(
          // @ts-expect-error Internal
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
        factory,
      })
    },

    assignRowPrototype: (prototype, table) => {
      // @ts-expect-error Internal
      if (table.options.reactivity?.row === false) {
        return
      }
      // @ts-expect-error Internal
      setReactivePropertiesOnObject(table.value, prototype, {
        skipProperty: getUserSkipPropertyFn(
          // @ts-expect-error Internal
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
        factory,
      })
    },
  }
}

/**
 * Default predicate used to skip base/non-reactive properties.
 */
function skipBaseProperties(property: string): boolean {
  return (
    // equals `getContext`
    property === 'getContext' ||
    // start with `_`
    property[0] === '_' ||
    // doesn't start with `get`, but faster
    !(property[0] === 'g' && property[1] === 'e' && property[2] === 't') ||
    // ends with `Handler`
    property.endsWith('Handler')
  )
}
