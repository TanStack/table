---
id: TableOptionsWithReactiveData
title: TableOptionsWithReactiveData
---

# Type Alias: TableOptionsWithReactiveData\<TFeatures, TData\>

```ts
type TableOptionsWithReactiveData<TFeatures, TData> = { [K in keyof TableOptions<TFeatures, TData>]: K extends "data" ? MaybeRef<ReadonlyArray<TData>> : MaybeRef<TableOptions<TFeatures, TData>[K]> };
```

Defined in: [packages/vue-table/src/useTable.ts:28](https://github.com/TanStack/table/blob/main/packages/vue-table/src/useTable.ts#L28)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`
