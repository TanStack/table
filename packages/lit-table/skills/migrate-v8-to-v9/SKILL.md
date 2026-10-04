---
name: migrate-v8-to-v9
description:
  Migrate lit Table v8 to v9. Audit framework construction, rendering, state, and
  app hooks, with shared API changes in the core migration skill.
metadata:
  type: lifecycle
  library: '@tanstack/lit-table'
  framework: lit
  library_version: '9.2.6'
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
sources:
  - TanStack/table:docs/framework/lit/guide/migrating.md
  - TanStack/table:packages/lit-table/src/index.ts
  - TanStack/table:examples/lit/basic-table-controller
---

Load `intent load @tanstack/table-core#migrate-v8-to-v9` first and audit its entire shared checklist. It owns feature registration, row-model slots, state/reset changes, prototype methods, logical pinning, sizing/resizing, sorting, selection, helpers, and TypeScript mappings.

## Framework prerequisites

Lit 3.1.3 or newer within v3 (`lit ^3.1.3`) and `@lit/context ^1.1.0` are required.

## Lit migration checklist

- [ ] Construct one `TableController<typeof features, TData>(this)` as a stable host field.
- [ ] Replace the v8 `controller.table` property/options thunk with `controller.table(options, selector?)` during render.
- [ ] Read selected `table.state` for rendering; use atom snapshots in handlers or stable `table.subscribe` selectors for template regions.
- [ ] Feed resolved controlled callbacks back through reactive Lit properties, or use stable external atoms.
- [ ] Switch render helpers to `FlexRender({ cell })`, `FlexRender({ header })`, or `FlexRender({ footer })` and preserve instance-method receivers.
- [ ] If app conventions repeat, construct a host-bound `useAppTable` once and call its `.table()` during render.

## Apply the affected mappings

Read [adapter-migration](references/adapter-migration.md) when changing construction, rendering, state, or app hooks. Read the relevant core migration references for each affected shared API; this adapter checklist does not replace that audit.

For complete v9 construction examples, read [getting-started](../getting-started/SKILL.md). For reactive state repairs, read [table-state](../table-state/SKILL.md).

## Final checks

- [ ] All shared core migration checks and affected mappings have been applied.
- [ ] The framework checklist above passes with the current adapter declarations.
- [ ] Model inputs remain stable and state changes reach their reactive owner.

## API discovery

Inspect `node_modules/@tanstack/lit-table/dist/index.d.ts`, then `TableController.d.ts`, `flexRender.d.ts`, or the relevant exported declaration. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.
