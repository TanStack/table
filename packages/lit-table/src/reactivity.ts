import { batch, createAtom } from '@tanstack/lit-store'
import { renderPhaseReactivity } from '@tanstack/table-core/reactivity'
import type { RenderPhaseReactivityBindings } from '@tanstack/table-core/reactivity'

export type LitTableReactivityBindings = RenderPhaseReactivityBindings

/**
 * Creates the table-core reactivity bindings used by the Lit adapter.
 *
 * Lit calls `controller.table(options)` from the host's `render()`, so option
 * atoms are staged without notification during the update cycle. The
 * render-phase preset supplies live option facades, cached memo atoms, and the
 * commit hook; `TableController` publishes its captured state and option token
 * from `hostUpdated()`. Store primitives come from `@tanstack/lit-store`.
 */
export function litReactivity(): LitTableReactivityBindings {
  return renderPhaseReactivity({ createAtom, batch })
}
