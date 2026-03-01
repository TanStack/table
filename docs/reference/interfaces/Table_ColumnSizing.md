---
id: Table_ColumnSizing
title: Table_ColumnSizing
---

# Interface: Table\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L22)

## Properties

### getCenterTotalSize()

```ts
getCenterTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L26)

If pinning, returns the total size of the center portion of the table by calculating the sum of the sizes of all unpinned/center leaf-columns.

#### Returns

`number`

***

### getLeftTotalSize()

```ts
getLeftTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L30)

Returns the total size of the left portion of the table by calculating the sum of the sizes of all left leaf-columns.

#### Returns

`number`

***

### getRightTotalSize()

```ts
getRightTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L34)

Returns the total size of the right portion of the table by calculating the sum of the sizes of all right leaf-columns.

#### Returns

`number`

***

### getTotalSize()

```ts
getTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L38)

Returns the total size of the table by calculating the sum of the sizes of all leaf-columns.

#### Returns

`number`

***

### resetColumnSizing()

```ts
resetColumnSizing: (defaultState?) => void;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L42)

Resets column sizing to its initial state. If `defaultState` is `true`, the default state for the table will be used instead of the initialValue provided to the table.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setColumnSizing()

```ts
setColumnSizing: (updater) => void;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L46)

Sets the column sizing state using an updater function or a value. This will trigger the underlying `onColumnSizingChange` function if one is passed to the table options, otherwise the state will be managed automatically by the table.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnSizingState`](../type-aliases/ColumnSizingState.md)\>

#### Returns

`void`
