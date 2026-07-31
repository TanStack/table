---
id: ExternalAtoms_All
title: ExternalAtoms_All
---

# Type Alias: ExternalAtoms\_All

```ts
type ExternalAtoms_All = Partial<{ [K in keyof TableState_All]: Atom<Exclude<TableState_All[K], undefined>> }>;
```

Defined in: [core/table/coreTablesFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L123)
