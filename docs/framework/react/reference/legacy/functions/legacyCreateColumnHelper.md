---
id: legacyCreateColumnHelper
title: legacyCreateColumnHelper
---

# ~~Function: legacyCreateColumnHelper()~~

```ts
function legacyCreateColumnHelper<TData>(): ColumnHelper<StockFeatures, TData>;
```

Defined in: [useLegacyTable.ts:323](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L323)

## Type Parameters

### TData

`TData` *extends* `RowData`

## Returns

`ColumnHelper`\<`StockFeatures`, `TData`\>

## Deprecated

Use `createColumnHelper<TFeatures, TData>()` with useTable instead.

A column helper with StockFeatures pre-bound for use with useLegacyTable.
Only requires TData—no need to specify TFeatures.
