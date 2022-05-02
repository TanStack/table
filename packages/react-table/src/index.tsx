import * as React from 'react'
export * from '@tanstack/table-core'

import {
  createTableInstance,
  TableOptions,
  TableInstance,
  Table,
  TableGenerics,
  createTableFactory,
  Overwrite,
  PartialKeys,
} from '@tanstack/table-core'

export type Renderable<TProps> =
  | React.ReactNode
  | React.FunctionComponent<TProps>
  | React.Component<TProps>

export type Render = <TProps extends {}>(
  Comp: Renderable<TProps>,
  props: TProps
) => React.ReactNode | JSX.Element

export type ReactTableGenerics = Overwrite<
  TableGenerics,
  { Renderer: Render; Rendered: ReturnType<Render> }
>

//

export const render: Render = (Comp, props) =>
  !Comp ? null : isReactComponent(Comp) ? <Comp {...props} /> : Comp

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

export const createTable = createTableFactory({ render })

const useIsomorphicLayoutEffect =
  typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect

export type UseTableInstanceOptions<TGenerics extends ReactTableGenerics> =
  PartialKeys<
    Omit<TableOptions<TGenerics>, 'render'>,
    'state' | 'onStateChange'
  >

export function useTableInstance<TGenerics extends ReactTableGenerics>(
  table: Table<TGenerics>,
  options: UseTableInstanceOptions<TGenerics>
): TableInstance<TGenerics> {
  // Compose in the generic options to the user options
  const resolvedOptions: TableOptions<TGenerics> = {
    ...table.options,
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

  useIsomorphicLayoutEffect(() => {
    instance.willUpdate()
  })

  return instance
}
