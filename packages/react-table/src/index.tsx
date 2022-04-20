import * as React from 'react'
export * from '@tanstack/table-core'

import {
  createTableInstance,
  PartialKeys,
  Options,
  TableInstance,
  CreateTableFactoryOptions,
  Table,
  init,
  AnyGenerics,
} from '@tanstack/table-core'

export type Renderable<TProps> =
  | React.ReactNode
  | React.FunctionComponent<TProps>
  | React.Component<TProps>

export const render = <TProps extends {}>(
  Comp: Renderable<TProps>,
  props: TProps
): React.ReactNode =>
  !Comp ? null : isReactComponent(Comp) ? <Comp {...props} /> : Comp

export type Render = typeof render

function isReactComponent(component: unknown): component is React.FC {
  return (
    isClassComponent(component) ||
    typeof component === 'function' ||
    isExoticComponent(component)
  )
}

function isClassComponent(component: any) {
  return (
    typeof component === 'function' &&
    (() => {
      const proto = Object.getPrototypeOf(component)
      return proto.prototype && proto.prototype.isReactComponent
    })()
  )
}

function isExoticComponent(component: any) {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
  )
}

const { createTable, createTableFactory } = init({ render })

export { createTable, createTableFactory }

export function useTableInstance<TGenerics extends AnyGenerics>(
  table: Table<TGenerics>,
  options: PartialKeys<
    Omit<
      Options<TGenerics>,
      keyof CreateTableFactoryOptions<any, any, any, any>
    >,
    'state' | 'onStateChange'
  >
): TableInstance<TGenerics> {
  // Compose in the generic options to the user options
  const resolvedOptions: Options<TGenerics> = {
    ...(table.__options ?? {}),
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    render,
    ...options,
  }

  // Create a new table instance and store it in state
  const [instance] = React.useState(() =>
    createTableInstance<TGenerics>(resolvedOptions)
  )

  // By default, manage table state here using the instance's initial state
  const [state, setState] = React.useState(() => instance.initialState)

  // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.
  instance.setOptions(prev => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: updater => {
      setState(updater)
      options.onStateChange?.(updater)
    },
  }))

  return instance
}
