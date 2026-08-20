---
id: CreatedSortFn
title: CreatedSortFn
---

# Interface: CreatedSortFn()\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L81)

The shape returned by `constructSortFn`: a `SortFn` with its definition
attached, so variants can be built by spreading it into another
`constructSortFn` call.

The call signature is generic so a created sorting function can be used
with any table's rows, regardless of the feature set it was defined
against.

## Extends

- [`SortFnDef`](SortFnDef.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

```ts
CreatedSortFn<TRowFeatures, TRowData>(
   rowA,
   rowB,
   columnId): number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L85)

The shape returned by `constructSortFn`: a `SortFn` with its definition
attached, so variants can be built by spreading it into another
`constructSortFn` call.

The call signature is generic so a created sorting function can be used
with any table's rows, regardless of the feature set it was defined
against.

## Type Parameters

### TRowFeatures

`TRowFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TRowData

`TRowData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### rowA

[`Row`](../type-aliases/Row.md)\<`TRowFeatures`, `TRowData`\>

### rowB

[`Row`](../type-aliases/Row.md)\<`TRowFeatures`, `TRowData`\>

### columnId

`string`

## Returns

`number`

## Properties

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L69)

#### Inherited from

[`SortFnDef`](SortFnDef.md).[`resolveDataValue`](SortFnDef.md#resolvedatavalue)

***

### sort()

```ts
sort: (dataValueA, dataValueB, rowA, rowB, columnId) => number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L62)

#### Parameters

##### dataValueA

`any`

##### dataValueB

`any`

##### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

`number`

#### Inherited from

[`SortFnDef`](SortFnDef.md).[`sort`](SortFnDef.md#sort)
