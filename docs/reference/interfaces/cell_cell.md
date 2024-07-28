---
id: Cell_Cell
title: Cell_Cell
---

# Interface: Cell\_Cell\<TFeatures, TData, TValue\>

## Extends

- [`Cell_CoreProperties`](cell_coreproperties.md)\<`TFeatures`, `TData`, `TValue`\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

The associated Column object for the cell.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#column)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Inherited from

[`Cell_CoreProperties`](cell_coreproperties.md).[`column`](Cell_CoreProperties.md#column)

#### Defined in

[core/cells/Cells.types.ts:31](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L31)

***

### getContext()

```ts
getContext: () => CellContext<TFeatures, TData, TValue>;
```

Returns the rendering context (or props) for cell-based components like cells and aggregated cells. Use these props with your framework's `flexRender` utility to render these using the template of your choice:

#### Returns

[`CellContext`](cellcontext.md)\<`TFeatures`, `TData`, `TValue`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#getcontext)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Defined in

[core/cells/Cells.types.ts:56](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L56)

***

### getValue

```ts
getValue: Getter<TValue>;
```

Returns the value for the cell, accessed via the associated column's accessor key or accessor function.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#getvalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Defined in

[core/cells/Cells.types.ts:62](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L62)

***

### id

```ts
id: string;
```

The unique ID for the cell across the entire table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#id)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Inherited from

[`Cell_CoreProperties`](cell_coreproperties.md).[`id`](Cell_CoreProperties.md#id)

#### Defined in

[core/cells/Cells.types.ts:37](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L37)

***

### renderValue

```ts
renderValue: Getter<null | TValue>;
```

Renders the value for a cell the same as `getValue`, but will return the `renderFallbackValue` if no value is found.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#rendervalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Defined in

[core/cells/Cells.types.ts:68](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L68)

***

### row

```ts
row: Row<TFeatures, TData>;
```

The associated Row object for the cell.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#row)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Inherited from

[`Cell_CoreProperties`](cell_coreproperties.md).[`row`](Cell_CoreProperties.md#row)

#### Defined in

[core/cells/Cells.types.ts:43](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L43)
