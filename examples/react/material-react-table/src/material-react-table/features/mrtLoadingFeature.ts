import type { TableFeature } from '@tanstack/react-table'

export interface MRT_TableState_Loading {
  isLoading: boolean
  isSaving: boolean
  showLoadingOverlay: boolean
  showProgressBars: boolean
  showSkeletons: boolean
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtLoadingFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtLoadingFeature: MRT_TableState_Loading
  }
}

/**
 * The loading/saving flags are driven entirely by the controlled `state`
 * option (no setters). Registering them as feature state gives each one a base
 * atom, so a controlled `state: { isLoading: true }` is synced into
 * `table.state.isLoading` and picked up by the loading overlay / skeletons.
 */
export const mrtLoadingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    isLoading: false,
    isSaving: false,
    showLoadingOverlay: false,
    showProgressBars: false,
    showSkeletons: false,
    ...initialState,
  }),
}
