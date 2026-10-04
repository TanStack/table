# Angular v8-to-v9 adapter migration

Read when applying the Angular construction, state, rendering, or reusable-hook checks. Complete the shared audit with `intent load @tanstack/table-core#migrate-v8-to-v9`; its references own the shared feature and type rename inventories.

This reference inherits the version of its owning skill.

## Framework requirements

Angular 19 or newer is required (`@angular/core >=19`).

## Construction

| v8                                  | v9                                                             |
| ----------------------------------- | -------------------------------------------------------------- |
| `createAngularTable(() => options)` | `injectTable(() => options)` in injection context              |
| `table.getState().sorting`          | `table.atoms.sorting.get()` inside tracked Angular consumption |

The initializer reruns when signals read inside it change and calls `setOptions`. Keep features and columns stable outside it. Construct in a component/directive/service field or another valid injection context so lifecycle cleanup is registered correctly.

## Angular state migration

- `table.getState().sorting` becomes `table.atoms.sorting.get()` for narrow signal-backed reads.
- Use `table.store.get()` only for a full flat snapshot/debug output.
- Derive selected slices with Angular `computed`; use `shallow` equality for recreated object/array slices when appropriate.
- Controlled Angular signals are read in `state` and updated through matching `on[State]Change` callbacks; resolve value-or-function updaters.
- Prefer external atoms from `@tanstack/angular-store` through `atoms` for app-owned shared slices. Never provide both an atom and `state` for one slice.

## Angular rendering and composition

- Import `FlexRender`/the current `*flexRender` directives from the adapter.
- Prefer `*flexRenderCell="cell; let value"`, `*flexRenderHeader="header; let value"`, and `*flexRenderFooter="footer; let value"`; they choose the definition and context automatically.
- General `*flexRender` supports primitives, `TemplateRef`, component types, and `flexRenderComponent(...)` wrappers.
- Column render functions run in an Angular injection context and may call `inject()` or use signals.
- Components mounted by FlexRender can call `injectFlexRenderContext()` for the render props.
- Use `flexRenderComponent(Component, { inputs, outputs, injector, bindings, directives })` for explicit component configuration; creation-time `bindings`/`directives` require the supported Angular version.
- `tableOptions(...)` composes partial options and may omit data, columns, or features until final assembly.
- `createTableHook` is optional for repeated application conventions; it returns `injectAppTable` and a feature-bound `createAppColumnHelper`.

## Related task guidance

For a full construction example, read [getting-started](../../getting-started/SKILL.md). For tracked reads and controlled updates, read [table-state](../../table-state/SKILL.md). When creating a reusable app factory, read [create-table-hook](../../getting-started/references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for the bundled public declarations. Inspect feature APIs under `node_modules/@tanstack/table-core/dist/features/`.

## Sources

- `TanStack/table:docs/framework/angular/guide/migrating.md`
- `TanStack/table:packages/angular-table/src/index.ts`
- `TanStack/table:examples/angular/basic-inject-table`
