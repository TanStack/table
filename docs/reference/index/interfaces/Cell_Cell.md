---
id: Cell_Cell
title: Cell_Cell
---

# Interface: Cell\_Cell\<TFeatures, TData, TValue\>

Defined in: [core/cells/coreCellsFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L44)

## Extends

- [`Cell_CoreProperties`](Cell_CoreProperties.md)\<`TFeatures`, `TData`, `TValue`\>

## Extended by

- [`Cell_Core`](Cell_Core.md)

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

Defined in: [core/cells/coreCellsFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L29)

The associated Column object for the cell.

#### Inherited from

[`Cell_CoreProperties`](Cell_CoreProperties.md).[`column`](Cell_CoreProperties.md#column)

***

### getContext()

```ts
getContext: () => CellContext<TFeatures, TData, TValue>;
```

Defined in: [core/cells/coreCellsFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L52)

Returns the rendering context (or props) for cell-based components like cells and aggregated cells. Use these props with your framework's `flexRender` utility to render these using the template of your choice:

#### Returns

[`CellContext`](CellContext.md)\<`TFeatures`, `TData`, `TValue`\>

***

### getValue

```ts
getValue: Getter<TValue>;
```

Defined in: [core/cells/coreCellsFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L56)

Returns the value for the cell, accessed via the associated column's accessor key or accessor function.

***

### id

```ts
id: string;
```

Defined in: [core/cells/coreCellsFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L33)

The unique ID for the cell across the entire table.

#### Inherited from

[`Cell_CoreProperties`](Cell_CoreProperties.md).[`id`](Cell_CoreProperties.md#id)

***

### renderValue

```ts
renderValue: Getter<TValue | null>;
```

Defined in: [core/cells/coreCellsFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L60)

Renders the value for a cell the same as `getValue`, but will return the `renderFallbackValue` if no value is found.

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [core/cells/coreCellsFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L37)

The associated Row object for the cell.

#### Inherited from

[`Cell_CoreProperties`](Cell_CoreProperties.md).[`row`](Cell_CoreProperties.md#row)

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [core/cells/coreCellsFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L41)

Reference to the parent table instance.

#### Inherited from

[`Cell_CoreProperties`](Cell_CoreProperties.md).[`table`](Cell_CoreProperties.md#table)
