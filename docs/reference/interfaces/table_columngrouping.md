---
id: Table_ColumnGrouping
title: Table_ColumnGrouping
---

# Interface: Table\_ColumnGrouping\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getGroupedRowModel()

```ts
getGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table after grouping has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:238](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L238)

***

### getPreGroupedRowModel()

```ts
getPreGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table before any grouping has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getpregroupedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:244](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L244)

***

### resetGrouping()

```ts
resetGrouping: (defaultState?) => void;
```

Resets the **grouping** state to `initialState.grouping`, or `true` can be passed to force a default blank state reset to `[]`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#resetgrouping)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:250](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L250)

***

### setGrouping()

```ts
setGrouping: (updater) => void;
```

Updates the grouping state of the table via an update function or value.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`GroupingState`](../type-aliases/groupingstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#setgrouping)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:256](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L256)
