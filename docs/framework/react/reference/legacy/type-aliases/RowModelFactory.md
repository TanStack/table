---
id: RowModelFactory
title: RowModelFactory
---

# Type Alias: RowModelFactory()\<TData\>

```ts
type RowModelFactory<TData> = (table) => () => RowModel<StockFeatures, TData>;
```

Defined in: [useLegacyTable.ts:162](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L162)

Row model factory function type from v8 API

## Type Parameters

### TData

`TData` *extends* `RowData`

## Parameters

### table

`Table`\<`StockFeatures`, `TData`\>

## Returns

```ts
(): RowModel<StockFeatures, TData>;
```

### Returns

`RowModel`\<`StockFeatures`, `TData`\>
