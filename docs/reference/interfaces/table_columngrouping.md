---
id: Table_ColumnGrouping
title: Table_ColumnGrouping
---

# Interface: Table\_ColumnGrouping\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

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

[features/column-grouping/ColumnGrouping.types.ts:226](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L226)

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

[features/column-grouping/ColumnGrouping.types.ts:232](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L232)
