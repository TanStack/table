---
id: FacetedUniqueValuesFactory
title: FacetedUniqueValuesFactory
---

# Type Alias: FacetedUniqueValuesFactory()\<TData\>

```ts
type FacetedUniqueValuesFactory<TData> = (table, columnId) => () => Map<any, number>;
```

Defined in: [react-table/src/useLegacyTable.ts:200](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L200)

Faceted unique values factory function type from v8 API

## Type Parameters

### TData

`TData` *extends* `RowData`

## Parameters

### table

`Table`\<[`LegacyFeatures`](../interfaces/LegacyFeatures.md), `TData`\>

### columnId

`string`

## Returns

```ts
(): Map<any, number>;
```

### Returns

`Map`\<`any`, `number`\>
