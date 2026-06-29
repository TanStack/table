---
id: Column_ColumnPinning
title: Column_ColumnPinning
---

# Interface: Column\_ColumnPinning

Defined in: [features/column-pinning/columnPinningFeature.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L49)

## Properties

### getCanPin()

```ts
getCanPin: () => boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L53)

Checks whether this column or any of its leaves can be pinned.

#### Returns

`boolean`

***

### getIsPinned()

```ts
getIsPinned: () => ColumnPinningPosition;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L57)

Reads the column's pinned position: `'left'`, `'right'`, or `false`.

#### Returns

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

***

### getPinnedIndex()

```ts
getPinnedIndex: () => number;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L61)

Finds this column's index within its pinned region.

#### Returns

`number`

***

### pin()

```ts
pin: (position) => void;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L66)

Pins this column's leaf columns left or right, or unpins them when `false`
is passed.

#### Parameters

##### position

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

#### Returns

`void`
