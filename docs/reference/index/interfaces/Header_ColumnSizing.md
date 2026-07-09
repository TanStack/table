---
id: Header_ColumnSizing
title: Header_ColumnSizing
---

# Interface: Header\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L132)

## Properties

### getSize()

```ts
getSize: () => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L136)

Computes this header's rendered size from its leaf columns.

#### Returns

`number`

***

### getStart()

```ts
getStart: (position?) => number;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L140)

Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding headers.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

#### Returns

`number`
