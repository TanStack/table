---
id: FacetedUniqueValuesFactory
title: FacetedUniqueValuesFactory
---

# Type Alias: FacetedUniqueValuesFactory()\<TData\>

```ts
type FacetedUniqueValuesFactory<TData> = (table, columnId) => () => Map<any, number>;
```

Defined in: [useLegacyTable.ts:185](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L185)

Faceted unique values factory function type from v8 API

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
(): Map<any, number>;
```

### Returns

`Map`\<`any`, `number`\>
