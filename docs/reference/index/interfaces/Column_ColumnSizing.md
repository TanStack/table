---
id: Column_ColumnSizing
title: Column_ColumnSizing
---

# Interface: Column\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L112)

## Properties

### getAfter()

```ts
getAfter: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L119)

Measures the offset from this column's end edge to the end of its region.

Pass a pinned region to measure within that logical region. The value is
the sum of visible leaf column sizes after this column.

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L123)

Resolves the column's current size after state and min/max constraints.

#### Returns

`number`

***

### getStart()

```ts
getStart: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L131)

Measures the offset from the start of this column's region to its start
edge.

Pass a pinned region to measure within that logical region. The value is
the sum of visible leaf column sizes before this column.

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L135)

Resets the column to its initial size.

#### Returns

`void`
