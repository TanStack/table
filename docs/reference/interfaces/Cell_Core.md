---
id: Cell_Core
title: Cell_Core
---

# Interface: Cell\_Core\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/types/Cell.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Cell.ts#L16)

## Extends

- [`Cell_Cell`](Cell_Cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L29)

The associated Column object for the cell.

#### Inherited from

[`Cell_Cell`](Cell_Cell.md).[`column`](Cell_Cell.md#column)

***

### getContext()

```ts
getContext: () => CellContext<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L52)

Returns the rendering context (or props) for cell-based components like cells and aggregated cells. Use these props with your framework's `flexRender` utility to render these using the template of your choice:

#### Returns

[`CellContext`](CellContext.md)\<`TFeatures`, `TData`, `TValue`\>

#### Inherited from

[`Cell_Cell`](Cell_Cell.md).[`getContext`](Cell_Cell.md#getcontext)

***

### getValue

```ts
getValue: Getter<TValue>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L56)

Returns the value for the cell, accessed via the associated column's accessor key or accessor function.

#### Inherited from

[`Cell_Cell`](Cell_Cell.md).[`getValue`](Cell_Cell.md#getvalue)

***

### id

```ts
id: string;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L33)

The unique ID for the cell across the entire table.

#### Inherited from

[`Cell_Cell`](Cell_Cell.md).[`id`](Cell_Cell.md#id)

***

### renderValue

```ts
renderValue: Getter<TValue | null>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L60)

Renders the value for a cell the same as `getValue`, but will return the `renderFallbackValue` if no value is found.

#### Inherited from

[`Cell_Cell`](Cell_Cell.md).[`renderValue`](Cell_Cell.md#rendervalue)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L37)

The associated Row object for the cell.

#### Inherited from

[`Cell_Cell`](Cell_Cell.md).[`row`](Cell_Cell.md#row)

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L41)

Reference to the parent table instance.

#### Inherited from

[`Cell_Cell`](Cell_Cell.md).[`table`](Cell_Cell.md#table)
