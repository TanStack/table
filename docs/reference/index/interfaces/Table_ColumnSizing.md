---
id: Table_ColumnSizing
title: Table_ColumnSizing
---

# Interface: Table\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L62)

## Properties

### getCenterTotalSize()

```ts
getCenterTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L66)

Sums the current sizes of visible center-region leaf columns.

#### Returns

`number`

***

### getColumnOffsets()

```ts
getColumnOffsets: () => ColumnOffsetsByPosition;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L73)

Returns memoized column offset maps (start and after offsets keyed by
column id) for each pinning region plus the full visible leaf column list.

Backs `column.getStart()` and `column.getAfter()` with O(1) lookups.

#### Returns

[`ColumnOffsetsByPosition`](ColumnOffsetsByPosition.md)

***

### getEndTotalSize()

```ts
getEndTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L81)

Sums the current sizes of visible logical end-pinned leaf columns.

#### Returns

`number`

***

### getStartTotalSize()

```ts
getStartTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L77)

Sums the current sizes of visible logical start-pinned leaf columns.

#### Returns

`number`

***

### getTotalSize()

```ts
getTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L85)

Sums the current sizes of all visible leaf columns.

#### Returns

`number`

***

### resetColumnSizing()

```ts
resetColumnSizing: (defaultState?) => void;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L90)

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L94)

Updates committed column sizing state with a next map or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnSizingState`](../type-aliases/ColumnSizingState.md)\>

#### Returns

`void`
