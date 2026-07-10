---
id: Column_ColumnPinning
title: Column_ColumnPinning
---

# Interface: Column\_ColumnPinning

Defined in: [features/column-pinning/columnPinningFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L60)

## Properties

### getCanPin()

```ts
getCanPin: () => boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L64)

Checks whether this column or any of its leaves can be pinned.

#### Returns

`boolean`

***

### getIsPinned()

```ts
getIsPinned: () => ColumnPinningPosition;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L68)

Reads the column's logical pinned position: `'start'`, `'end'`, or `false`.

#### Returns

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

***

### getPinnedIndex()

```ts
getPinnedIndex: () => number;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L72)

Finds this column's index within its pinned region.

#### Returns

`number`

***

### pin()

```ts
pin: (position) => void;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L77)

Pins this column's leaf columns to logical start or end, or unpins them
when `false` is passed.

#### Parameters

##### position

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

#### Returns

`void`
