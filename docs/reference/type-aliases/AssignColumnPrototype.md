---
id: AssignColumnPrototype
title: AssignColumnPrototype
---

# Type Alias: AssignColumnPrototype()\<TConstructors\>

```ts
type AssignColumnPrototype<TConstructors> = <TFeatures, TData>(prototype, table) => void;
```

Defined in: [packages/table-core/src/types/TableFeatures.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L85)

## Type Parameters

### TConstructors

`TConstructors` *extends* `FeatureConstructors`

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
