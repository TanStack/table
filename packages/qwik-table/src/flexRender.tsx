import { isFunction } from '@tanstack/table-core'
import type { Component, FunctionComponent } from '@builder.io/qwik'

type QwikComps = Component | FunctionComponent

const isQwikComponent = (comp: unknown): comp is QwikComps =>
  isFunction(comp) && comp.name === 'QwikComponent'

export function flexRender<TProps extends object>(
  Comp: any, // TODO: add renderable type
  props: TProps,
) {
  return !Comp ? null : isQwikComponent(Comp) ? (
    <Comp {...props} />
  ) : isFunction(Comp) ? (
    Comp(props)
  ) : (
    Comp
  )
}
