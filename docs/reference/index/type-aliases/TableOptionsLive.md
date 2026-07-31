---
id: TableOptionsLive
title: TableOptionsLive
---

# Type Alias: TableOptionsLive\<TFeatures, TData\>

```ts
type TableOptionsLive<TFeatures, TData> = { readonly [K in keyof TableOptions<TFeatures, TData>]: TableOptions<TFeatures, TData>[K] };
```

Defined in: [core/table/coreTablesFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L97)

The stable readonly options view exposed by `table.options`.

Every property read is routed to the matching existing option atom.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
