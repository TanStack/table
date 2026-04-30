---
id: FacetedMinMaxValuesFactory
title: FacetedMinMaxValuesFactory
---

# Type Alias: FacetedMinMaxValuesFactory()\<TData\>

```ts
type FacetedMinMaxValuesFactory<TData> = (table, columnId) => () => undefined | [number, number];
```

Defined in: [useLegacyTable.ts:177](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L177)

Faceted min/max values factory function type from v8 API

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
(): undefined | [number, number];
```

### Returns

`undefined` \| \[`number`, `number`\]
