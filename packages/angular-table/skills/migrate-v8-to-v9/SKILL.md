---
name: migrate-v8-to-v9
description:
  Migrate angular Table v8 to v9. Audit framework construction, rendering, state,
  and app hooks, with shared API changes in the core migration skill.
metadata:
  type: lifecycle
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.2.8'
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
sources:
  - TanStack/table:docs/framework/angular/guide/migrating.md
  - TanStack/table:packages/angular-table/src/index.ts
  - TanStack/table:examples/angular/basic-inject-table
---

Load `intent load @tanstack/table-core#migrate-v8-to-v9` first and audit its entire shared checklist. It owns feature registration, row-model slots, state/reset changes, prototype methods, logical pinning, sizing/resizing, sorting, selection, helpers, and TypeScript mappings.

## Framework prerequisites

Angular 19 or newer is required (`@angular/core >=19`).

## Angular migration checklist

- [ ] Replace `createAngularTable` with `injectTable` in a valid Angular injection context.
- [ ] Hoist features, columns, and factories outside the signal-tracked initializer.
- [ ] Read state through signal-backed atoms; wire controlled signals with value-or-updater callbacks or stable Angular Store atoms.
- [ ] Import current FlexRender directives, distinguish render functions from component types, and preserve instance-method receivers.
- [ ] Audit repeated options and component registries for the optional `createTableHook`/`injectAppTable` path.

## Apply the affected mappings

Read [adapter-migration](references/adapter-migration.md) when changing construction, rendering, state, or app hooks. Read the relevant core migration references for each affected shared API; this adapter checklist does not replace that audit.

For complete v9 construction examples, read [getting-started](../getting-started/SKILL.md). For reactive state repairs, read [table-state](../table-state/SKILL.md).

## Final checks

- [ ] All shared core migration checks and affected mappings have been applied.
- [ ] The framework checklist above passes with the current adapter declarations.
- [ ] Model inputs remain stable and state changes reach their reactive owner.

## API discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for the bundled public declarations. Inspect feature APIs under `node_modules/@tanstack/table-core/dist/features/`.
