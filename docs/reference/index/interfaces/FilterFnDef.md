---
id: FilterFnDef
title: FilterFnDef
---

# Interface: FilterFnDef\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L102)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L113)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L106)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L115)

***

### resolveFilterValue()?

```ts
optional resolveFilterValue: (filterValue) => any;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L114)

#### Parameters

##### filterValue

`any`

#### Returns

`any`
