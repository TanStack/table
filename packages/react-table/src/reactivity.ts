import { batch, createAtom } from '@tanstack/react-store'
import { renderPhaseReactivity } from '@tanstack/table-core/reactivity'
import type { RenderPhaseReactivityBindings } from '@tanstack/table-core/reactivity'

export type ReactTableReactivityBindings = RenderPhaseReactivityBindings

/**
 * Creates the table-core reactivity bindings used by the React adapter.
 *
 * React stores table state in TanStack Store atoms and leaves options as plain
 * resolved data because `useTable` synchronizes options during render. The
 * render-phase preset supplies the live readonly-atom facades and the `commit`
 * hook; the store primitives are passed in from `@tanstack/react-store` so all
 * atoms share one store instance with user-provided external atoms.
 */
export function reactReactivity(): ReactTableReactivityBindings {
  return renderPhaseReactivity({ createAtom, batch })
}
