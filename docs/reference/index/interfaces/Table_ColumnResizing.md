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

Defined in: [features/column-resizing/columnResizingFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L53)

Resets transient resize interaction state to `initialState.columnResizing`.
Pass `true` to reset to the feature's default blank resize state instead.

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

Defined in: [features/column-resizing/columnResizingFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts#L60)

Sets the transient resize interaction state using a value or updater.

The lowercase `c` in this API name matches the current generated v9 table
API for the `columnResizing` state slice.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`columnResizingState`](columnResizingState.md)\>

#### Returns

`void`
