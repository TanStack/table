---
id: FilterFnDef
title: FilterFnDef
---

# Interface: FilterFnDef\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L97)

The definition object accepted by `constructFilterFn`.

`filter` is a value-level comparator: it receives the row's (resolved) data
value and the (resolved) filter value instead of the whole row, so
normalization concerns stay in `resolveDataValue`/`resolveFilterValue`.

## Extended by

- [`CreatedFilterFn`](CreatedFilterFn.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### autoRemove()?

```ts
optional autoRemove: (filterValue) => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L108)

#### Parameters

##### filterValue

`any`

#### Returns

`boolean`

***

### filter()

```ts
filter: (dataValue, filterValue, row, columnId, addMeta?) => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L101)

#### Parameters

##### dataValue

`any`

##### filterValue

`any`

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

##### addMeta?

(`meta`) => `void`

#### Returns

`boolean`

***

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L110)

***

### resolveFilterValue()?

```ts
optional resolveFilterValue: (filterValue) => any;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L109)

#### Parameters

##### filterValue

`any`

#### Returns

`any`
