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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L27)

Finds this column's zero-based index among visible columns.

Pass `'left'`, `'center'`, or `'right'` to measure within that pinned
region instead of the full visible leaf order.

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L33)

Checks whether this column is the first visible column.

Pass a pinned region to check the first column within that region.

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

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L39)

Checks whether this column is the last visible column.

Pass a pinned region to check the last column within that region.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

`boolean`
