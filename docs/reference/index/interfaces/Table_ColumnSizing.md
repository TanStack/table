---
id: Table_ColumnSizing
title: Table_ColumnSizing
---

# Interface: Table\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L24)

## Properties

### getCenterTotalSize()

```ts
getCenterTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L28)

Sums the current sizes of visible center-region leaf columns.

#### Returns

`number`

***

### getLeftTotalSize()

```ts
getLeftTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L32)

Sums the current sizes of visible left-pinned leaf columns.

#### Returns

`number`

***

### getRightTotalSize()

```ts
getRightTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L36)

Sums the current sizes of visible right-pinned leaf columns.

#### Returns

`number`

***

### getTotalSize()

```ts
getTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L40)

Sums the current sizes of all visible leaf columns.

#### Returns

`number`

***

### resetColumnSizing()

```ts
resetColumnSizing: (defaultState?) => void;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L45)

Resets column sizing to `initialState.columnSizing`. Pass `true` to reset
to the feature default of `{}`.

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L49)

Updates committed column sizing state with a next map or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnSizingState`](../type-aliases/ColumnSizingState.md)\>

#### Returns

`void`
