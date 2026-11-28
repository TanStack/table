---
'@tanstack/table-core': patch
'@tanstack/react-table': patch
'@tanstack/preact-table': patch
'@tanstack/svelte-table': patch
'@tanstack/lit-table': patch
'@tanstack/octane-table': patch
'@tanstack/alpine-table': patch
---

Bridge external atom subscriptions across separate `@tanstack/store` instances and re-export each store-backed adapter's store helpers (`createAtom`, `useCreateAtom`, `useSelector`, etc.) so mismatched transitive store versions remain reactive and users can import store primitives directly from their table adapter.
