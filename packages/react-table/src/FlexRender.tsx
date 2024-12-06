import * as React from 'react'

export type Renderable<TProps> = React.ReactNode | React.ComponentType<TProps>

function isReactComponent<TProps>(
  component: unknown,
): component is React.ComponentType<TProps> {
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

/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
 * @example flexRender(cell.column.columnDef.cell, cell.getContext())
 */
export function flexRender<TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps,
): React.ReactNode | React.JSX.Element {
  return !Comp ? null : isReactComponent<TProps>(Comp) ? (
    <Comp {...props} />
  ) : (
    Comp
  )
}

/**
 * Component version of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.
 * @example <FlexRender Component={cell.column.columnDef.cell} props={cell.getContext()} />
 */
export function FlexRender<TProps extends object>({
  Component,
  props,
}: {
  Component: Renderable<TProps>
  props: TProps
}) {
  return flexRender(Component, props)
}
