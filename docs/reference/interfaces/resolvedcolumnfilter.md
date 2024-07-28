---
id: ResolvedColumnFilter
title: ResolvedColumnFilter
---

# Interface: ResolvedColumnFilter\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### filterFn

```ts
filterFn: FilterFn<TFeatures, TData>;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:32](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L32)

***

### id

```ts
id: string;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:33](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L33)

***

### resolvedValue

```ts
resolvedValue: unknown;
```

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:34](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L34)
