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

[features/column-resizing/ColumnResizing.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L58)

***

### setcolumnResizing()

```ts
setcolumnResizing: (updater) => void;
```

Sets the column sizing info state using an updater function or a value. This will trigger the underlying `oncolumnResizingChange` function if one is passed to the table options, otherwise the state will be managed automatically by the table.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`columnResizingState`](columnresizingstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#setcolumnResizing)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-resizing/ColumnResizing.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/ColumnResizing.types.ts#L64)
