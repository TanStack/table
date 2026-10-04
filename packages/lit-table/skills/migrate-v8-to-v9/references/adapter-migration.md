# Lit v8-to-v9 adapter migration

Read when applying the Lit construction, state, rendering, or reusable-hook checks. Complete the shared audit with `intent load @tanstack/table-core#migrate-v8-to-v9`; its references own the shared feature and type rename inventories.

This reference inherits the version of its owning skill.

## Framework requirements

Lit 3.1.3 or newer within v3 (`lit ^3.1.3`) and `@lit/context ^1.1.0` are required.

## Construction

| v8                                         | v9                                                   |
| ------------------------------------------ | ---------------------------------------------------- |
| `new TableController(this, () => options)` | `new TableController<typeof features, TData>(this)`  |
| `controller.table` property                | `controller.table(options, selector?)` during render |

The controller owns host subscriptions and cleanup. Keep it as a field and supply current stable model inputs during render. Constructing it on every render repeats lifecycle work.

## Lit state migration

- `table.getState().sorting` becomes selected `table.state.sorting` for rendering or `table.atoms.sorting.get()` for a current snapshot. Store snapshots do not establish template subscriptions.
- `table.state` contains all registered slices by default. Pass a second-argument selector to `controller.table(...)` only to narrow the render-selected surface.
- Use `table.subscribe(table.store, stableSelector, renderCallback)` for selected template state. Keep the selector reference stable outside render.
- Controlled state uses Lit `@state()` fields and matching `on[State]Change` callbacks that resolve value-or-function updaters.
- External atoms come from `@tanstack/store` and are provided through `atoms`. Never provide both `atoms.pagination` and `state.pagination`.
- The controller owns state subscriptions and requests host updates. Apply current options with `controller.table(...)` during render; keep the controller as a stable host field.

## Rendering and composition

| v8                         | v9                                                                            |
| -------------------------- | ----------------------------------------------------------------------------- |
| `flexRender(def, context)` | `FlexRender({ cell })`, `FlexRender({ header })`, or `FlexRender({ footer })` |
| Standalone helper only     | `table.FlexRender({ cell })` is also available                                |
| Repeated raw options       | `tableOptions(...)` composition                                               |
| Repeated conventions       | `createTableHook({ features, ... })`                                          |

`createTableHook` returns a host-bound app table helper and pre-bound column helper. Construct the app helper with the Lit host, then call its `.table()` during render. It is optional and intended for recurring application conventions.

## Related task guidance

For a full construction example, read [getting-started](../../getting-started/SKILL.md). For tracked reads and controlled updates, read [table-state](../../table-state/SKILL.md). When creating a reusable app factory, read [create-table-hook](../../getting-started/references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/lit-table/dist/index.d.ts`, then `TableController.d.ts`, `flexRender.d.ts`, or the relevant exported declaration. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.

## Sources

- `TanStack/table:docs/framework/lit/guide/migrating.md`
- `TanStack/table:packages/lit-table/src/index.ts`
- `TanStack/table:examples/lit/basic-table-controller`
