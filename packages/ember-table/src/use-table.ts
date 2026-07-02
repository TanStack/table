import { constructTable } from '@tanstack/table-core'
import { untrack } from '@glimmer/validator'
import { computed, emberReactivity } from './reactivity.ts'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core';

// Internal table slots used by the pull-based options/state wiring below.
// `Table_Internal` is not exported from the table-core build, so the shape is
// declared structurally here.
interface TableInternals<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  optionsStore?: {
    get(): TableOptions<TFeatures, TData>
    set(value: () => TableOptions<TFeatures, TData>): void
  }
  baseAtoms: Record<string, { get(): unknown }>
  atoms: Record<string, unknown>
}

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  getOptions: () => TableOptions<TFeatures, TData>,
): Table<TFeatures, TData> {
  const reactivity = emberReactivity()

  // Memoized on whatever tracked state getOptions() reads (data, controlled
  // state slices, etc.), so the options object identity is stable between
  // changes to those tracked values.
  const userOptions = computed(getOptions)

  const initialOptions = untrack(() => userOptions.get())

  const table = constructTable<TFeatures, TData>({
    ...initialOptions,
    features: {
      coreReactivityFeature: reactivity,
      ...initialOptions.features,
    },
    mergeOptions: (
      defaultOptions: TableOptions<TFeatures, TData>,
      newOptions: Partial<TableOptions<TFeatures, TData>>,
    ) => ({
      ...defaultOptions,
      ...newOptions,
    }),
  }) as Table<TFeatures, TData> & TableInternals<TFeatures, TData>

  // constructTable snapshots options once. Other adapters re-push new options
  // into the table with a framework effect (`table.setOptions`), but Ember has
  // no public effect primitive, so this adapter is pull-based instead:
  //
  // 1. `table.options` overlays the latest getOptions() result on top of the
  //    options store, so option reads always see current tracked values.
  // 2. Controlled state slices (`options.state.*`) are read directly by the
  //    derived state atoms below, replacing core's push-sync
  //    (`table_syncExternalStateToBaseAtoms`), which would require an effect
  //    to re-run on external state changes.
  const optionsStore = table.optionsStore!

  const liveOptions = computed(() => {
    const stored = optionsStore.get()
    return {
      ...stored,
      ...userOptions.get(),
      // stored options carry construct-time normalization (the reactivity
      // feature, wrapped external atoms) that must win over the raw user
      // options.
      features: stored.features,
      atoms: stored.atoms,
    }
  })

  Object.defineProperty(table, 'options', {
    configurable: true,
    enumerable: true,
    get: () => liveOptions.get(),
    set: (value: TableOptions<TFeatures, TData>) => {
      optionsStore.set(() => value)
    },
  })

  for (const key of Object.keys(table.baseAtoms)) {
    const baseAtom = (table.baseAtoms as Record<string, { get(): unknown }>)[
      key
    ]!
    ;(table.atoms as Record<string, unknown>)[key] =
      reactivity.createReadonlyAtom(
        () => {
          const externalAtom = (
            table.options.atoms as
              | Record<string, { get(): unknown }>
              | undefined
          )?.[key]
          if (externalAtom) {
            return externalAtom.get()
          }
          const stateSlice = (
            table.options.state as Record<string, unknown> | undefined
          )?.[key]
          if (stateSlice !== undefined) {
            return stateSlice
          }
          return baseAtom.get()
        },
        { debugName: `table/atoms/${key}` },
      )
  }

  return table
}
