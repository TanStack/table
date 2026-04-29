---
id: FacetedRowModelFactory
title: FacetedRowModelFactory
---

# Type Alias: FacetedRowModelFactory()\<TData\>

```ts
type FacetedRowModelFactory<TData> = (table, columnId) => () => RowModel<StockFeatures, TData>;
```

Defined in: [useLegacyTable.ts:169](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L169)

Faceted row model factory function type from v8 API

## Type Parameters

### TData

`TData` *extends* `RowData`

## Parameters

### table

`Table`\<`StockFeatures`, `TData`\>

### columnId

`string`

## Returns

```ts
(): RowModel<StockFeatures, TData>;
```

### Returns

`RowModel`\<`StockFeatures`, `TData`\>
