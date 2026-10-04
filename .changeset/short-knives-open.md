---
'@tanstack/table-core': patch
'@tanstack/react-table': patch
'@tanstack/preact-table': patch
'@tanstack/solid-table': patch
'@tanstack/svelte-table': patch
'@tanstack/vue-table': patch
'@tanstack/angular-table': patch
'@tanstack/lit-table': patch
'@tanstack/alpine-table': patch
'@tanstack/ember-table': patch
'@tanstack/octane-table': patch
'@tanstack/match-sorter-utils': patch
---

Refactor bundled Intent skills into smaller entry points with references loaded for the current task. Keep core feature architecture and shared state directly discoverable, and move individual features, adapter compositions, and detailed migration guidance into references.

Consumers with individual skill permissions or explicit agent mappings must replace retired feature/composition IDs with their owning entry points and refresh Intent mappings. See the Agent Skills guide for the replacement paths.
