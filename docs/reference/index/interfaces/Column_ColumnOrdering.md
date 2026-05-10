---
id: Column_ColumnOrdering
title: Column_ColumnOrdering
---

# Interface: Column\_ColumnOrdering

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L20)

## Properties

### getIndex()

```ts
getIndex: (position?) => number;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L24)

Returns the index of the column in the order of the visible columns. Optionally pass a `position` parameter to get the index of the column in a sub-section of the table

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

`number`

***

### getIsFirstColumn()

```ts
getIsFirstColumn: (position?) => boolean;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L28)

Returns `true` if the column is the first column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the first in a sub-section of the table.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

`boolean`

***

### getIsLastColumn()

```ts
getIsLastColumn: (position?) => boolean;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L32)

Returns `true` if the column is the last column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the last in a sub-section of the table.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

`boolean`
