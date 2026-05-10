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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L71)

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L75)

Returns the current size of the column.

#### Returns

`number`

***

### getStart()

```ts
getStart: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L79)

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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L83)

Resets the column to its initial size.

#### Returns

`void`
