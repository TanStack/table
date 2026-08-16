import { useLayoutEffect, useState } from 'preact/hooks'
import {
  Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect,
} from '@tanstack/virtual-core'
import type { PartialKeys, VirtualizerOptions } from '@tanstack/virtual-core'

export const TRADING_ROW_HEIGHT = 32
export const TRADING_ROW_OVERSCAN = 10
export const DEFAULT_VIRTUALIZATION_ROW_COUNT = 200
export const FORCED_VIRTUALIZATION_ROW_COUNT = 1_500

export type VirtualScrollMode = 'tanstack' | 'none'
export type VirtualScrollPreference = VirtualScrollMode | 'auto'

export function resolveVirtualScrollMode(
  requestedMode: VirtualScrollPreference,
  instrumentCount: number,
): VirtualScrollMode {
  if (instrumentCount >= FORCED_VIRTUALIZATION_ROW_COUNT) return 'tanstack'
  if (requestedMode !== 'auto') return requestedMode
  return instrumentCount >= DEFAULT_VIRTUALIZATION_ROW_COUNT
    ? 'tanstack'
    : 'none'
}

export function useVirtualizer<
  TScrollElement extends Element,
  TItemElement extends Element,
>(
  options: PartialKeys<
    VirtualizerOptions<TScrollElement, TItemElement>,
    'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
  >,
): Virtualizer<TScrollElement, TItemElement> {
  const [, setRenderVersion] = useState(0)
  const resolvedOptions: VirtualizerOptions<TScrollElement, TItemElement> = {
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
    ...options,
    onChange: (instance, sync) => {
      setRenderVersion((version) => version + 1)
      options.onChange?.(instance, sync)
    },
  }
  const [instance] = useState(
    () => new Virtualizer<TScrollElement, TItemElement>(resolvedOptions),
  )

  instance.setOptions(resolvedOptions)
  useLayoutEffect(() => instance._didMount(), [instance])
  useLayoutEffect(() => instance._willUpdate())

  return instance
}
