---
name: migrate-v8-to-v9
description: Migrate vue Table v8 to v9. Audit framework construction, rendering, state, and app hooks, with shared API changes in the core migration skill.
metadata:
  type: lifecycle
  library: '@tanstack/vue-table'
  framework: vue
  library_version: 9.2.5
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
sources:
  - TanStack/table:docs/framework/vue/guide/migrating.md
  - TanStack/table:packages/vue-table/src/index.ts
  - TanStack/table:examples/vue/basic-use-table
---

# Vue v8-to-v9 migration checklist

Before starting, run `intent load @tanstack/table-core#migrate-v8-to-v9`. Audit its entire shared checklist and read the detailed core mappings for APIs present in the application. This checklist adds the Vue-specific changes.

Framework prerequisite: Vue 3.2 or newer (`vue >=3.2`).

## Adapter audit

- [ ] Replace `useVueTable` with `useTable` and preserve ref/computed/getter inputs.
- [ ] Keep features and columns stable, configure explicit features/row-model slots, and complete the shared core checklist.
- [ ] Replace `getState()` with tracked atom reads or intentional whole-store reads. Use `computed` for derived template values.
- [ ] Pair controlled reactive values with callbacks that resolve both updater forms, or supply stable Vue Store atoms. Remove global `onStateChange`.
- [ ] Pass `table.Subscribe` callbacks as the explicit `children` prop in JSX.
- [ ] Adopt FlexRender cell/header/footer shorthand; the old render/props shape remains supported.
- [ ] Use `tableOptions` or `createTableHook` only for repeated conventions and explicit context-hook export types when needed to break circular inference.

## Load the affected details

When the audit finds old Vue construction, state, rendering, or app-hook code, read [adapter migration details](references/adapter-migration.md) before editing it. For a replacement render scaffold, read [getting started](../getting-started/SKILL.md). For controlled or stale state after migration, read [table state](../table-state/SKILL.md).

Shared pinning, sizing, sorting, selection, prototype-method, type, and registry changes stay in the core migration references. Renaming `useVueTable` alone does not complete the migration.

## Verify the migration

- [ ] Type-check against the installed v9 adapter and exercise every enabled client/manual feature flow.
- [ ] Verify external state writes, reactive data replacement, and the framework rendering paths changed above.
- [ ] Complete the core checklist, including layout and selection behavior when those features are used.
- [ ] Replace temporary `stockFeatures` when the target is explicit feature tree-shaking.

## API discovery

Inspect `node_modules/@tanstack/vue-table/dist/index.d.ts` and the exported adapter declarations. Use `node_modules/@tanstack/table-core/dist/index.d.ts` for shared APIs.
