---
id: Column_ColumnPinning
title: Column_ColumnPinning
---

# Interface: Column\_ColumnPinning

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L41)

## Properties

### getCanPin()

```ts
getCanPin: () => boolean;
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L45)

Returns whether or not the column can be pinned.

#### Returns

`boolean`

***

### getIsPinned()

```ts
getIsPinned: () => ColumnPinningPosition;
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L49)

Returns the pinned position of the column. (`'left'`, `'right'` or `false`)

#### Returns

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

***

### getPinnedIndex()

```ts
getPinnedIndex: () => number;
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L53)

Returns the numeric pinned index of the column within a pinned column group.

#### Returns

`number`

***

### pin()

```ts
pin: (position) => void;
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L57)

Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.

#### Parameters

##### position

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

#### Returns

`void`
