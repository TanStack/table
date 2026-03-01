---
id: Header_ColumnSizing
title: Header_ColumnSizing
---

# Interface: Header\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L83)

## Properties

### getSize()

```ts
getSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L87)

Returns the current size of the header.

#### Returns

`number`

***

### getStart()

```ts
getStart: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L91)

Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding headers.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

#### Returns

`number`
