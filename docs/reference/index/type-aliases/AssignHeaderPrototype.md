---
id: AssignHeaderPrototype
title: AssignHeaderPrototype
---

# Type Alias: AssignHeaderPrototype()\<TConstructors\>

```ts
type AssignHeaderPrototype<TConstructors> = <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L93)

## Type Parameters

### TConstructors

`TConstructors` *extends* [`FeatureConstructors`](../interfaces/FeatureConstructors.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

## Parameters

### prototype

`Record`\<`string`, `any`\>

### table

[`Table_Internal`](Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`
