---
name: migrate-v8-to-v9
description: Migrate svelte Table v8 to v9. Audit framework construction, rendering, state, and app hooks, with shared API changes in the core migration skill.
metadata:
  type: lifecycle
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: 9.2.5
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
sources:
  - TanStack/table:docs/framework/svelte/guide/migrating.md
  - TanStack/table:packages/svelte-table/src/index.ts
  - TanStack/table:examples/svelte/basic-create-table
---

# Svelte v8-to-v9 migration checklist

Before starting, run `intent load @tanstack/table-core#migrate-v8-to-v9`. Audit its entire shared checklist and read the detailed core mappings for APIs present in the application. This checklist adds the Svelte-specific changes.

Framework prerequisite: Svelte 5 (`svelte ^5.0.0`); migrate Svelte 3/4 components before Table.

## Adapter audit

- [ ] Upgrade to Svelte 5 and replace old writable-store table setup with runes/getters.
- [ ] Replace `createSvelteTable` with `createTable`; preserve changing data and controlled slices through getters.
- [ ] Configure explicit features/row-model slots and complete the shared core checklist.
- [ ] Remove creation selectors, selected `table.state`, `subscribeTable`, and `SubscribeSource` from earlier v9 code.
- [ ] Update `SvelteTable` to two generic parameters and `AppSvelteTable` to five; remove selected-state generics from `useTableContext`.
- [ ] Read atoms/store in templates or tracked runes. Use per-slice updater callbacks, `createTableState`, or external Svelte Store atoms instead of global `onStateChange`.
- [ ] Render with `FlexRender`, `renderComponent`, or `renderSnippet`. Use the shipped rune-aware `createTableHook` only for repeated conventions.

## Load the affected details

When the audit finds old Svelte construction, state, rendering, or app-hook code, read [adapter migration details](references/adapter-migration.md) before editing it. For a replacement render scaffold, read [getting started](../getting-started/SKILL.md). For controlled or stale state after migration, read [table state](../table-state/SKILL.md).

Shared pinning, sizing, sorting, selection, prototype-method, type, and registry changes stay in the core migration references. Renaming `createSvelteTable` alone does not complete the migration.

## Verify the migration

- [ ] Type-check against the installed v9 adapter and exercise every enabled client/manual feature flow.
- [ ] Verify external state writes, reactive data replacement, and the framework rendering paths changed above.
- [ ] Complete the core checklist, including layout and selection behavior when those features are used.
- [ ] Replace temporary `stockFeatures` when the target is explicit feature tree-shaking.

## API discovery

Inspect `node_modules/@tanstack/svelte-table/dist/index.d.ts` and the exported adapter declarations. Use `node_modules/@tanstack/table-core/dist/index.d.ts` for shared APIs.
