---
id: Row_RowPinning
title: Row_RowPinning
---

# Interface: Row\_RowPinning

Defined in: [features/row-pinning/rowPinningFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L38)

## Properties

### getCanPin()

```ts
getCanPin: () => boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L42)

Returns whether or not the row can be pinned.

#### Returns

`boolean`

***

### getIsPinned()

```ts
getIsPinned: () => RowPinningPosition;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L46)

Returns the pinned position of the row. (`'top'`, `'bottom'` or `false`)

#### Returns

[`RowPinningPosition`](../type-aliases/RowPinningPosition.md)

***

### getPinnedIndex()

```ts
getPinnedIndex: () => number;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L50)

Returns the numeric pinned index of the row within a pinned row group.

#### Returns

`number`

***

### pin()

```ts
pin: (position, includeLeafRows?, includeParentRows?) => void;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L54)

Pins a row to the `'top'` or `'bottom'`, or unpins the row to the center if `false` is passed.

#### Parameters

##### position

[`RowPinningPosition`](../type-aliases/RowPinningPosition.md)

##### includeLeafRows?

`boolean`

##### includeParentRows?

`boolean`

#### Returns

`void`
