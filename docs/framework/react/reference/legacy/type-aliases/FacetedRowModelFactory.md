---
id: FacetedRowModelFactory
title: FacetedRowModelFactory
---

# Type Alias: FacetedRowModelFactory()\<TData\>

```ts
type FacetedRowModelFactory<TData> = (table, columnId) => () => RowModel<LegacyFeatures, TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:184](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L184)

Faceted row model factory function type from v8 API

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
(): RowModel<LegacyFeatures, TData>;
```

### Returns

`RowModel`\<[`LegacyFeatures`](../interfaces/LegacyFeatures.md), `TData`\>
