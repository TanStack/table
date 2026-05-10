---
id: BaseAtoms
title: BaseAtoms
---

# Type Alias: BaseAtoms\<TFeatures\>

```ts
type BaseAtoms<TFeatures> = { [K in keyof TableState<TFeatures>]-?: Atom<TableState<TFeatures>[K]> };
```

Defined in: [core/table/coreTablesFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L20)

A map of writable atoms, one per `TableState` slice. These are the internal
writable atoms that the library always writes to via `makeStateUpdater`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
