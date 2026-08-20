---
id: FacetedMinMaxValuesFactory
title: FacetedMinMaxValuesFactory
---

# Type Alias: FacetedMinMaxValuesFactory()\<TData\>

```ts
type FacetedMinMaxValuesFactory<TData> = (table, columnId) => () => undefined | [number, number];
```

Defined in: [react-table/src/useLegacyTable.ts:192](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L192)

Faceted min/max values factory function type from v8 API

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
(): undefined | [number, number];
```

### Returns

`undefined` \| \[`number`, `number`\]
