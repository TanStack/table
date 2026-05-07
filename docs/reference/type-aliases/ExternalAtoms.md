---
id: ExternalAtoms
title: ExternalAtoms
---

# Type Alias: ExternalAtoms\<TFeatures\>

```ts
type ExternalAtoms<TFeatures> = Partial<{ [K in keyof TableState<TFeatures>]: Atom<TableState<TFeatures>[K]> }>;
```

Defined in: [core/table/coreTablesFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L40)

A map of optional external atoms, one per `TableState` slice. Consumers can
provide their own writable atom for any state slice to take over ownership
of that slice.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
