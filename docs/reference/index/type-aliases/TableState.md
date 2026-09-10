---
id: TableState
title: TableState
---

# Type Alias: TableState\<TFeatures\>

```ts
type TableState<TFeatures> = ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>;
```

Defined in: [types/TableState.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableState.ts#L40)

Complete table state for a specific feature set.

State slices are included only when their feature is present in `TFeatures`,
then custom feature/plugin state is mixed in.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
