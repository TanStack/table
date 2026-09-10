---
id: RowSpanContext
title: RowSpanContext
---

# Interface: RowSpanContext\<TFeatures, TData, TValue\>

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L51)

Context passed to a `spanRows` predicate for each candidate row.

The run is anchored: `anchorRow` is the row whose cell will render the
merged content, and every later row in the run is tested against it, which
keeps runs transitive by construction. `previousRow` is provided for
predicates that want a step-wise comparison instead.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### anchorRow

```ts
anchorRow: Row<TFeatures, TData>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L56)

***

### anchorValue

```ts
anchorValue: TValue;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L57)

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L58)

***

### previousRow

```ts
previousRow: Row<TFeatures, TData>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L59)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L60)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L61)

***

### value

```ts
value: TValue;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L62)
