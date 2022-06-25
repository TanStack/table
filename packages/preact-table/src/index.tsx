import * as Preact from 'preact'
import * as PreactHooks from 'preact/hooks'
export * from '@tanstack/table-core'

import {
  createTableInstance,
  TableOptions,
  TableInstance,
  Table,
  TableGenerics,
  createTableFactory,
  Overwrite,
  TableOptionsResolved,
} from '@tanstack/table-core'

export type Renderable<TProps> =
  | Preact.FunctionalComponent<TProps>
  | Preact.Component<TProps>

export type Render = <TProps extends {}>(
  Comp: Renderable<TProps>,
  props: TProps
) => any | JSX.Element

export type PreactTableGenerics = Overwrite<
  TableGenerics,
  { Renderer: Render; Rendered: ReturnType<Render> }
>

//

export const render: Render = (Comp, props) =>
  !Comp ? null : isPreactComponent(Comp) ? <Comp {...props} /> : Comp

function isPreactComponent(
  component: unknown
): component is Preact.FunctionalComponent {
  return (
    // isClassComponent(component) ||
    typeof component === 'function' || true
    // isExoticComponent(component)
  )
}

// function isClassComponent(component: any) {
//   return (
//     typeof component === 'function' &&
//     (() => {
//       const proto = Object.getPrototypeOf(component)
//       return proto.prototype && proto.prototype.isReactComponent
//     })()
//   )
// }

// function isExoticComponent(component: any) {
//   return (
//     typeof component === 'object' &&
//     typeof component.$$typeof === 'symbol' &&
//     ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
//   )
// }

export const createTable = createTableFactory({ render })

// const useIsomorphicLayoutEffect =
//   typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect

export type UseTableInstanceOptions<TGenerics extends PreactTableGenerics> =
  TableOptions<TGenerics>

export function useTableInstance<TGenerics extends PreactTableGenerics>(
  table: Table<TGenerics>,
  options: UseTableInstanceOptions<TGenerics>
): TableInstance<TGenerics> {
  // Compose in the generic options to the user options
  const resolvedOptions: TableOptionsResolved<TGenerics> = {
    ...table.options,
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    render,
    renderFallbackValue: null,
    ...options,
  }

  // Create a new table instance and store it in state
  const [instanceRef] = PreactHooks.useState(() => ({
    current: createTableInstance<TGenerics>(resolvedOptions),
  }))

  // By default, manage table state here using the instance's initial state
  const [state, setState] = PreactHooks.useState(
    () => instanceRef.current.initialState
  )

  // Compose the default state above with any user state. This will allow the user
  // to only control a subset of the state if desired.
  instanceRef.current.setOptions(prev => ({
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

  return instanceRef.current
}
