---
id: InitRowInstanceData
title: InitRowInstanceData
---

# Type Alias: InitRowInstanceData()\<TConstructors\>

```ts
type InitRowInstanceData<TConstructors> = <TFeatures, TData>(row) => void;
```

Defined in: [types/TableFeatures.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L109)

## Type Parameters

### TConstructors

`TConstructors` *extends* `FeatureConstructors`

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

## Parameters

### row

[`Row`](Row.md)\<`TFeatures`, `TData`\> & `Partial`\<`TConstructors`\[`"Row"`\]\>

## Returns

`void`
