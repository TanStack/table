---
id: Column_ColumnSizing
title: Column_ColumnSizing
---

# Interface: Column\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L64)

## Properties

### getAfter()

```ts
getAfter: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L68)

Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all succeeding (right) headers in relation to the current column.

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L72)

Returns the current size of the column.

#### Returns

`number`

***

### getStart()

```ts
getStart: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L76)

Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding (left) headers in relation to the current column.

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L80)

Resets the column to its initial size.

#### Returns

`void`
