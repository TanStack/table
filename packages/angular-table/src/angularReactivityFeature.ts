import { computed, signal } from '@angular/core'
import { setReactivePropertiesOnObject } from './reactivityUtils'
import type { Signal } from '@angular/core'
import type {
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface TableOptions_Plugins<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > extends TableOptions_AngularReactivity {}

  interface Table_Plugins<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > extends Table_AngularReactivity<TFeatures, TData> {}
}

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
interface TableOptions_AngularReactivity {
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
interface Table_AngularReactivity<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns a table signal that updates whenever the table state or options changes.
   */
  get: Signal<Table<TFeatures, TData>>
  /**
   * Sets the reactive notifier that powers {@link get}.
   *
   * @internal Used by the Angular table adapter to connect its notifier to the core table.
   */
  setTableNotifier: (signal: Signal<Table<TFeatures, TData>>) => void
}

/**
 * Type map describing what this feature adds to TanStack Table constructors.
 */
interface AngularReactivityFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  TableOptions: TableOptions_AngularReactivity
  Table: Table_AngularReactivity<TFeatures, TData>
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

function constructAngularReactivityFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<AngularReactivityFeatureConstructors<TFeatures, TData>> {
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
      const rootNotifier = signal<Signal<any> | null>(null)
      table.setTableNotifier = (notifier) => rootNotifier.set(notifier)
      table.get = computed(() => rootNotifier()!(), { equal: () => false })
      setReactivePropertiesOnObject(table.get, table, {
        overridePrototype: false,
        skipProperty: skipBaseProperties,
      })
    },

    assignCellPrototype: (prototype, table) => {
      if (table.options.reactivity?.cell === false) {
        return
      }
      setReactivePropertiesOnObject(table.get, prototype, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
      })
    },

    assignColumnPrototype: (prototype, table) => {
      if (table.options.reactivity?.column === false) {
        return
      }
      setReactivePropertiesOnObject(table.get, prototype, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
      })
    },

    assignHeaderPrototype: (prototype, table) => {
      if (table.options.reactivity?.header === false) {
        return
      }
      setReactivePropertiesOnObject(table.get, prototype, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
      })
    },

    assignRowPrototype: (prototype, table) => {
      if (table.options.reactivity?.row === false) {
        return
      }
      setReactivePropertiesOnObject(table.get, prototype, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
      })
    },
  }
}

/**
 * Angular reactivity feature that add reactive signal supports in table core instance. 
 * This is used internally by the Angular table adapter `injectTable`.
 * 
 * @private
 */
export const angularReactivityFeature = constructAngularReactivityFeature()

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
