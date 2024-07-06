import { _createTable } from '@tanstack/table-core'
import { createComponent, createComputed, mergeProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import type {
  RowData,
  TableOptions,
  TableOptionsResolved,
} from '@tanstack/table-core'

import type { JSX } from 'solid-js'

export * from '@tanstack/table-core'

export function flexRender<TProps>(
  Comp: ((_props: TProps) => JSX.Element) | JSX.Element | undefined,
  props: TProps,
): JSX.Element {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return createComponent(Comp, props)
  }

  return Comp
}

export function createTable<TData extends RowData>(
  options: TableOptions<TData>,
) {
  const resolvedOptions: TableOptionsResolved<TData> = mergeProps(
    {
      state: {}, // Dummy state
      onStateChange: () => {}, // noop
      renderFallbackValue: null,
      mergeOptions: (
        defaultOptions: TableOptions<TData>,
        newOptions: Partial<TableOptions<TData>>,
      ) => {
        return mergeProps(defaultOptions, newOptions) as TableOptions<TData>
      },
    },
    options,
  )

  const table = _createTable<TData>(resolvedOptions)
  const [state, setState] = createStore(table.initialState)

  createComputed(() => {
    table.setOptions((prev) => {
      return mergeProps(prev, options, {
        state: mergeProps(state, options.state || {}),
        // Similarly, we'll maintain both our internal state and any user-provided
        // state.
        onStateChange: (updater: any) => {
          // merging isn't required because stores shallow update
          setState(updater)

          options.onStateChange?.(updater)
        },
      })
    })
  })

  return table
}
