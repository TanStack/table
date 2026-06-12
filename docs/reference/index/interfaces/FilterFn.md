---
id: FilterFn
title: FilterFn
---

# Interface: FilterFn()\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L59)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

```ts
FilterFn(
   row, 
   columnId, 
   filterValue, 
   addMeta?): boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L63)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### columnId

`string`

### filterValue

`any`

### addMeta?

(`meta`) => `void`

## Returns

`boolean`

## Properties

### autoRemove?

```ts
optional autoRemove: ColumnFilterAutoRemoveTestFn<TFeatures, TData, unknown>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L69)

***

### resolveFilterValue?

```ts
optional resolveFilterValue: TransformFilterValueFn<TFeatures, TData, unknown>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L70)
