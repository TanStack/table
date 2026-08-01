import { batch, createAtom } from '@tanstack/octane-store'
import { renderPhaseReactivity } from '@tanstack/table-core/reactivity'
import type { RenderPhaseReactivityBindings } from '@tanstack/table-core/reactivity'

export type OctaneTableReactivityBindings = RenderPhaseReactivityBindings

/**
 * Creates the table-core reactivity bindings used by the Octane adapter.
 *
 * The render-phase preset supplies live readonly-atom facades and commit-aware
 * external-state publication. Store primitives come from the Octane adapter so
 * table-created atoms, user-provided atoms, batching, and subscriptions all use
 * the same TanStack Store module instance.
 */
export function octaneReactivity(): OctaneTableReactivityBindings {
  return renderPhaseReactivity({ createAtom, batch })
}
