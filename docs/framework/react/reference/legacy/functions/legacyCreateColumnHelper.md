---
id: legacyCreateColumnHelper
title: legacyCreateColumnHelper
---

# ~~Function: legacyCreateColumnHelper()~~

```ts
function legacyCreateColumnHelper<TData>(): ColumnHelper<LegacyFeatures, TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:360](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L360)

## Type Parameters

### TData

`TData` *extends* `RowData`

## Returns

`ColumnHelper`\<[`LegacyFeatures`](../interfaces/LegacyFeatures.md), `TData`\>

## Deprecated

Use `createColumnHelper<TFeatures, TData>()` with useTable instead.

A column helper with LegacyFeatures pre-bound for use with useLegacyTable.
Only requires TData—no need to specify TFeatures.
