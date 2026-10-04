---
name: migrate-v8-to-v9
description: Migrate preact Table v8 to v9. Audit framework construction, rendering, state, and app hooks, with shared API changes in the core migration skill.
metadata:
  type: lifecycle
  library: '@tanstack/preact-table'
  library_version: '9.2.6'
  framework: preact
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
sources:
  - TanStack/table:docs/framework/preact/guide/migrating.md
  - TanStack/table:packages/preact-table/src/index.ts
  - TanStack/table:examples/preact/basic-use-table
---

# Preact v8-to-v9 migration checklist

Before starting, run `intent load @tanstack/table-core#migrate-v8-to-v9`. Audit its entire shared checklist and read the detailed core mappings for APIs present in the application. This checklist adds the Preact-specific changes.

Framework prerequisite: Preact 10 or newer (`preact >=10`).

## Adapter audit

- [ ] Replace React-adapter imports and `useReactTable` with native `@tanstack/preact-table` and `useTable`.
- [ ] Remove compat aliases that existed only for Table. Preserve aliases still required by other libraries, including a React Virtual integration.
- [ ] Keep model inputs stable and configure explicit features/row-model slots; complete the shared core checklist.
- [ ] Use selected `table.state`, `table.Subscribe`, or Preact Store subscriptions; snapshots alone do not rerender consumers.
- [ ] Pair controlled slices with callbacks, or supply stable atoms from `@tanstack/preact-store`; remove global `onStateChange`.
- [ ] Use native Preact FlexRender components. Adopt `tableOptions` or `createTableHook` only for repeated app conventions.

## Load the affected details

When the audit finds old Preact construction, state, rendering, or app-hook code, read [adapter migration details](references/adapter-migration.md) before editing it. For a replacement render scaffold, read [getting started](../getting-started/SKILL.md). For controlled or stale state after migration, read [table state](../table-state/SKILL.md).

Shared pinning, sizing, sorting, selection, prototype-method, type, and registry changes stay in the core migration references. Renaming `useReactTable` alone does not complete the migration.

## Verify the migration

- [ ] Type-check against the installed v9 adapter and exercise every enabled client/manual feature flow.
- [ ] Verify external state writes, reactive data replacement, and the framework rendering paths changed above.
- [ ] Complete the core checklist, including layout and selection behavior when those features are used.
- [ ] Replace temporary `stockFeatures` when the target is explicit feature tree-shaking.

## API discovery

Inspect `node_modules/@tanstack/preact-table/dist/index.d.ts` and the exported adapter declarations. Use `node_modules/@tanstack/table-core/dist/index.d.ts` for shared APIs.
