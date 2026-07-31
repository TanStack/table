import { batch, createAtom } from '@tanstack/preact-store'
import { renderPhaseReactivity } from '@tanstack/table-core/reactivity'
import type { RenderPhaseReactivityBindings } from '@tanstack/table-core/reactivity'

export type PreactTableReactivityBindings = RenderPhaseReactivityBindings

/**
 * Creates the table-core reactivity bindings used by the Preact adapter.
 *
 * Preact synchronizes option atoms during render without publishing them until
 * commit. The render-phase preset supplies live option facades, cached memo
 * atoms, and the commit hook; the store primitives come from
 * `@tanstack/preact-store` so all atoms share one store instance with
 * user-provided external atoms.
 */
export function preactReactivity(): PreactTableReactivityBindings {
  return renderPhaseReactivity({ createAtom, batch })
}
