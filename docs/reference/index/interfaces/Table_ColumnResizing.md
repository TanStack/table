---
id: Table_ColumnResizing
title: Table_ColumnResizing
---

# Interface: Table\_ColumnResizing

Defined in: [features/column-resizing/columnResizingFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L48)

## Properties

### resetHeaderSizeInfo()

```ts
resetHeaderSizeInfo: (defaultState?) => void;
```

Defined in: [features/column-resizing/columnResizingFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L54)

Resets `columnResizing` to `initialState.columnResizing`.

Pass `true` to ignore initial state and reset to the no-drag default state.

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

Defined in: [features/column-resizing/columnResizingFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L61)

Updates transient resize interaction state with a next state or updater function.

The lowercase `c` in this API name matches the current generated v9 table
API for the `columnResizing` state slice.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`columnResizingState`](columnResizingState.md)\>

#### Returns

`void`
