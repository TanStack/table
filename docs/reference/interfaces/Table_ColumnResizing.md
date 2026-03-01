---
id: Table_ColumnResizing
title: Table_ColumnResizing
---

# Interface: Table\_ColumnResizing

Defined in: [features/column-resizing/columnResizingFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L44)

## Properties

### resetHeaderSizeInfo()

```ts
resetHeaderSizeInfo: (defaultState?) => void;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L48)

Resets column sizing info to its initial state. If `defaultState` is `true`, the default state for the table will be used instead of the initialValue provided to the table.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setcolumnResizing()

```ts
setcolumnResizing: (updater) => void;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L52)

Sets the column sizing info state using an updater function or a value. This will trigger the underlying `oncolumnResizingChange` function if one is passed to the table options, otherwise the state will be managed automatically by the table.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`columnResizingState`](columnResizingState.md)\>

#### Returns

`void`
