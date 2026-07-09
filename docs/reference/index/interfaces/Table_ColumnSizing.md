---
id: Table_ColumnSizing
title: Table_ColumnSizing
---

# Interface: Table\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L56)

## Properties

### getCenterTotalSize()

```ts
getCenterTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L60)

Sums the current sizes of visible center-region leaf columns.

#### Returns

`number`

***

### getColumnOffsets()

```ts
getColumnOffsets: () => ColumnOffsetsByPosition;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L67)

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L75)

Sums the current sizes of visible end-pinned leaf columns.

#### Returns

`number`

***

### getStartTotalSize()

```ts
getStartTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L71)

Sums the current sizes of visible start-pinned leaf columns.

#### Returns

`number`

***

### getTotalSize()

```ts
getTotalSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L79)

Sums the current sizes of all visible leaf columns.

#### Returns

`number`

***

### resetColumnSizing()

```ts
resetColumnSizing: (defaultState?) => void;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L84)

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L88)

Updates committed column sizing state with a next map or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnSizingState`](../type-aliases/ColumnSizingState.md)\>

#### Returns

`void`
