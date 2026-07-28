import { batch, createAtom } from '@tanstack/lit-store'
import { renderPhaseReactivity } from '@tanstack/table-core/reactivity'
import type { RenderPhaseReactivityBindings } from '@tanstack/table-core/reactivity'

export type LitTableReactivityBindings = RenderPhaseReactivityBindings

/**
 * Creates the table-core reactivity bindings used by the Lit adapter.
 *
 * Lit calls `controller.table(options)` from the host's `render()`, so options
 * are plain values synchronized during the update cycle — writing a reactive
 * options store there would schedule a second update per interaction. The
 * render-phase preset supplies the live readonly-atom facades and the `commit`
 * hook; `TableController` publishes captured controlled state from
 * `hostUpdated()`. Store primitives come from `@tanstack/lit-store` so all
 * atoms share one store instance with user-provided external atoms.
 */
export function litReactivity(): LitTableReactivityBindings {
  return renderPhaseReactivity({ createAtom, batch })
}
