---
'@tanstack/alpine-table': patch
'@tanstack/angular-table': patch
'@tanstack/ember-table': patch
'@tanstack/lit-table': patch
'@tanstack/octane-table': patch
'@tanstack/preact-table': patch
'@tanstack/react-table': patch
'@tanstack/solid-table': patch
'@tanstack/svelte-table': patch
'@tanstack/table-core': patch
'@tanstack/vue-table': patch
---

Allow aggregated cells without an `aggregatedCell` renderer to fall back to the column `cell` renderer before using the default aggregate formatter.
