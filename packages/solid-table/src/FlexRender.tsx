import { createComponent } from 'solid-js'
import type { JSX } from 'solid-js'

export function flexRender<TProps>(
  Comp: ((_props: TProps) => JSX.Element) | JSX.Element | undefined,
  props: TProps,
): JSX.Element {
  if (!Comp) return null

  if (typeof Comp === 'function') {
    return createComponent(Comp, props as any)
  }

  return Comp
}

export function FlexRender<TProps>(
  props: {
    Comp: ((_props: TProps) => JSX.Element) | JSX.Element | undefined
  } & TProps,
): JSX.Element {
  return flexRender(props.Comp, props)
}
