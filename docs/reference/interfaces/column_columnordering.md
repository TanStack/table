---
id: Column_ColumnOrdering
title: Column_ColumnOrdering
---

# Interface: Column\_ColumnOrdering

## Properties

### getIndex()

```ts
getIndex: (position?) => number;
```

Returns the index of the column in the order of the visible columns. Optionally pass a `position` parameter to get the index of the column in a sub-section of the table

#### Parameters

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `"center"`

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#getindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

#### Defined in

[features/column-ordering/ColumnOrdering.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/ColumnOrdering.types.ts#L26)

***

### getIsFirstColumn()

```ts
getIsFirstColumn: (position?) => boolean;
```

Returns `true` if the column is the first column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the first in a sub-section of the table.

#### Parameters

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `"center"`

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#getisfirstcolumn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

#### Defined in

[features/column-ordering/ColumnOrdering.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/ColumnOrdering.types.ts#L32)

***

### getIsLastColumn()

```ts
getIsLastColumn: (position?) => boolean;
```

Returns `true` if the column is the last column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the last in a sub-section of the table.

#### Parameters

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `"center"`

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#getislastcolumn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

#### Defined in

[features/column-ordering/ColumnOrdering.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/ColumnOrdering.types.ts#L38)
