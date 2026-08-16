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
