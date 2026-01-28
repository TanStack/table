---
id: GetDefaultTableOptions
title: GetDefaultTableOptions
---

# Type Alias: GetDefaultTableOptions()\<TConstructors\>

```ts
type GetDefaultTableOptions<TConstructors> = <TFeatures, TData>(table) => Partial<TableOptions_All<TFeatures, TData>> & Partial<TConstructors["TableOptions"]>;
```

Defined in: [packages/table-core/src/types/TableFeatures.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L62)

## Type Parameters

### TConstructors

`TConstructors` *extends* `FeatureConstructors`

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

## Parameters

### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\> & `Partial`\<`TConstructors`\[`"Table"`\]\>

## Returns

`Partial`\<[`TableOptions_All`](TableOptions_All.md)\<`TFeatures`, `TData`\>\> & `Partial`\<`TConstructors`\[`"TableOptions"`\]\>
