---
id: FilterFn
title: FilterFn
---

# Interface: FilterFn()\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

```ts
interface FilterFn(
   row, 
   columnId, 
   filterValue, 
   addMeta): boolean
```

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

• **filterValue**: `any`

• **addMeta**

## Returns

`boolean`

## Defined in

[features/column-filtering/ColumnFiltering.types.ts:41](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L41)

## Properties

### autoRemove?

```ts
optional autoRemove: ColumnFilterAutoRemoveTestFn<TFeatures, TData, unknown>;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:47](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L47)

***

### resolveFilterValue?

```ts
optional resolveFilterValue: TransformFilterValueFn<TFeatures, TData, unknown>;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:48](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L48)
