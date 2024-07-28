---
id: Table_ColumnResizing
title: Table_ColumnResizing
---

# Interface: Table\_ColumnResizing

## Properties

### resetHeaderSizeInfo()

```ts
resetHeaderSizeInfo: (defaultState?) => void;
```

Resets column sizing info to its initial state. If `defaultState` is `true`, the default state for the table will be used instead of the initialValue provided to the table.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#resetheadersizeinfo)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-resizing/ColumnResizing.types.ts:58](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L58)

***

### setColumnSizingInfo()

```ts
setColumnSizingInfo: (updater) => void;
```

Sets the column sizing info state using an updater function or a value. This will trigger the underlying `onColumnSizingInfoChange` function if one is passed to the table options, otherwise the state will be managed automatically by the table.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnResizingInfoState`](columnresizinginfostate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#setcolumnsizinginfo)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-resizing/ColumnResizing.types.ts:64](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L64)
