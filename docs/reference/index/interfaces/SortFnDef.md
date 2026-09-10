---
id: SortFnDef
title: SortFnDef
---

# Interface: SortFnDef\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L58)

The definition object accepted by `constructSortFn`.

`sort` is a value-level comparator: it receives both rows' (resolved) data
values instead of the whole rows, so normalization concerns stay in
`resolveDataValue`.

## Extended by

- [`CreatedSortFn`](CreatedSortFn.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L69)

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
