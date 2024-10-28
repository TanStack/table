---
id: ResolvedColumnFilter
title: ResolvedColumnFilter
---

# Interface: ResolvedColumnFilter\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### filterFn

```ts
filterFn: FilterFn<TFeatures, TData>;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L33)

***

### id

```ts
id: string;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L34)

***

### resolvedValue

```ts
resolvedValue: unknown;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L35)
