export const TRADING_ROW_HEIGHT = 32
export const TRADING_ROW_OVERSCAN = 10
export const FORCED_VIRTUALIZATION_ROW_COUNT = 250

export type VirtualScrollMode = 'tanstack' | 'none'

export function resolveVirtualScrollMode(
  requestedMode: VirtualScrollMode,
  instrumentCount: number,
): VirtualScrollMode {
  return instrumentCount >= FORCED_VIRTUALIZATION_ROW_COUNT
    ? 'tanstack'
    : requestedMode
}
