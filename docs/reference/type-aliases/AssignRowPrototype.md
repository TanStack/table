---
id: AssignRowPrototype
title: AssignRowPrototype
---

# Type Alias: AssignRowPrototype()\<TConstructors\>

```ts
type AssignRowPrototype<TConstructors> = <TFeatures, TData>(prototype, table) => void;
```

Defined in: [types/TableFeatures.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L101)

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
