import type { ComponentChild, ComponentType } from 'preact'

export type Renderable<TProps> = ComponentChild | ComponentType<TProps>

function isPreactComponent<TProps>(
  component: unknown,
): component is ComponentType<TProps> {
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
      return proto.prototype && proto.prototype.isPreactComponent
    })()
  )
}

function isExoticComponent(component: any) {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['preact.memo', 'preact.forward_ref'].includes(
      component.$$typeof.description,
    )
  )
}

/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
 * @example flexRender(cell.column.columnDef.cell, cell.getContext())
 */
export function flexRender<TProps extends object>(
  Comp: Renderable<TProps> | null,
  props: TProps,
): ComponentChild | Element | null {
  return !Comp ? null : isPreactComponent<TProps>(Comp) ? (
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
