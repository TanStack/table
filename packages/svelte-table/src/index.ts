import {
  createTableFactory,
  createTableInstance as coreCreateTableInstance,
  Options,
  PartialKeys,
  Table,
  TableGenerics,
} from '@tanstack/table-core'
import { beforeUpdate } from 'svelte'
import Placeholder from './placeholder.svelte'
import { readable, writable, derived, Readable, get } from 'svelte/store'
import { renderComponent } from './render-component'

export { renderComponent } from './render-component'

export * from '@tanstack/table-core'

export function render(Comp: any, props: any) {
  if (!Comp) return null

  if (Comp instanceof Function) {
    let res = Comp(props)
    return res
  } else {
    return renderComponent(Placeholder, { content: Comp })
  }

  // return Comp
}

export const createTable = createTableFactory({ render })

type ReadableOrVal<T> = T | Readable<T>

export function createTableInstance<TGenerics extends TableGenerics>(
  table: Table<TGenerics>,
  options: ReadableOrVal<
    PartialKeys<Omit<Options<TGenerics>, 'render'>, 'state' | 'onStateChange'>
  >
) {
  let optionsStore: Readable<
    PartialKeys<Omit<Options<TGenerics>, 'render'>, 'state' | 'onStateChange'>
  >

  if ('subscribe' in options) {
    optionsStore = options
  } else {
    optionsStore = readable(options)
  }

  let resolvedOptions: Options<TGenerics> = {
    ...table.options,
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    render,
    ...get(optionsStore),
  }

  let instance = coreCreateTableInstance(resolvedOptions)

  beforeUpdate(() => {
    instance.willUpdate()
  })

  let stateStore = writable(/** @type {number} */ instance.initialState)
  // combine stores
  let stateOptionsStore = derived([stateStore, optionsStore], s => s)
  const instanceReadable = readable(instance, function start(set) {
    const unsubscribe = stateOptionsStore.subscribe(([state, options]) => {
      instance.setOptions(prev => {
        return {
          ...prev,
          ...options,
          state: { ...state, ...options.state },
          // Similarly, we'll maintain both our internal state and any user-provided
          // state.
          onStateChange: updater => {
            console.log('STATE CHANGE')
            if (updater instanceof Function) {
              stateStore.update(updater)
            } else {
              stateStore.set(updater)
            }

            resolvedOptions.onStateChange?.(updater)
          },
        }
      })

      // it didn't seem to rerender without setting the instance
      set(instance)
    })

    return function stop() {
      unsubscribe()
    }
  })

  return instanceReadable
}
