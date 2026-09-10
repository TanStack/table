---
id: RowModelFactory
title: RowModelFactory
---

# Type Alias: RowModelFactory()\<TData\>

```ts
type RowModelFactory<TData> = (table) => () => RowModel<LegacyFeatures, TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:177](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L177)

Row model factory function type from v8 API

## Type Parameters

### TData

`TData` *extends* `RowData`

## Parameters

### table

`Table`\<[`LegacyFeatures`](../interfaces/LegacyFeatures.md), `TData`\>

## Returns

```ts
(): RowModel<LegacyFeatures, TData>;
```

### Returns

`RowModel`\<[`LegacyFeatures`](../interfaces/LegacyFeatures.md), `TData`\>
