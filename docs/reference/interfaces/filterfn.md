---
id: FilterFn
title: FilterFn
---

# Interface: FilterFn()\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

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

[features/column-filtering/ColumnFiltering.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L49)

## Properties

### autoRemove?

```ts
optional autoRemove: ColumnFilterAutoRemoveTestFn<TFeatures, TData, unknown>;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L55)

***

### resolveFilterValue?

```ts
optional resolveFilterValue: TransformFilterValueFn<TFeatures, TData, unknown>;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L56)
