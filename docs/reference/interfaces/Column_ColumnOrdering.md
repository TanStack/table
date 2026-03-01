---
id: Column_ColumnOrdering
title: Column_ColumnOrdering
---

# Interface: Column\_ColumnOrdering

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L18)

## Properties

### getIndex()

```ts
getIndex: (position?) => number;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L22)

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L26)

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L30)

Returns `true` if the column is the last column in the order of the visible columns. Optionally pass a `position` parameter to check if the column is the last in a sub-section of the table.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

`boolean`
