import { batch, createAtom } from '@tanstack/react-store'
import { renderPhaseReactivity } from '@tanstack/table-core/reactivity'
import type { RenderPhaseReactivityBindings } from '@tanstack/table-core/reactivity'

export type ReactTableReactivityBindings = RenderPhaseReactivityBindings

/**
 * Creates the table-core reactivity bindings used by the React adapter.
 *
 * React synchronizes option atoms during render without publishing them until
 * commit. The render-phase preset supplies live option facades, cached memo
 * atoms, and the commit hook; the store primitives come from
 * `@tanstack/react-store` so all atoms share one store instance with
 * user-provided external atoms.
 */
export function reactReactivity(): ReactTableReactivityBindings {
  return renderPhaseReactivity({ createAtom, batch })
}
