---
id: Column_ColumnSizing
title: Column_ColumnSizing
---

# Interface: Column\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L67)

## Properties

### getAfter()

```ts
getAfter: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L74)

Measures the offset from this column's end edge to the end of its region.

Pass a pinned region to measure within that region. The value is the sum
of visible leaf column sizes after this column.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

`number`

***

### getSize()

```ts
getSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L78)

Resolves the column's current size after state and min/max constraints.

#### Returns

`number`

***

### getStart()

```ts
getStart: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L86)

Measures the offset from the start of this column's region to its start
edge.

Pass a pinned region to measure within that region. The value is the sum
of visible leaf column sizes before this column.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

`number`

***

### resetSize()

```ts
resetSize: () => void;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L90)

Resets the column to its initial size.

#### Returns

`void`
