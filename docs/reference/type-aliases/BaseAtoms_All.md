---
id: BaseAtoms_All
title: BaseAtoms_All
---

# Type Alias: BaseAtoms\_All

```ts
type BaseAtoms_All = { [K in keyof TableState_All]?: Atom<TableState_All[K]> };
```

Defined in: [core/table/coreTablesFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L54)

Internal "all features" flat variants of the atom types. `Table_Internal`
uses these so feature code (written generically over `TFeatures`) can access
any slice atom (e.g. `table.atoms.columnPinning`) without TypeScript
narrowing away slices that aren't in the current `TFeatures` union.

Keys are optional: feature code can read atoms from slices it doesn't own,
but those slices may not be registered on the current table. Consumers must
use optional chaining (`table.atoms.columnPinning?.get() ?? default`).
