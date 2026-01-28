---
id: ConstructTableAPIs
title: ConstructTableAPIs
---

# Type Alias: ConstructTableAPIs()\<TConstructors\>

```ts
type ConstructTableAPIs<TConstructors> = <TFeatures, TData>(table) => void;
```

Defined in: [packages/table-core/src/types/TableFeatures.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L45)

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

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\> & `Partial`\<`TConstructors`\[`"Table"`\]\> & `object`

## Returns

`void`
