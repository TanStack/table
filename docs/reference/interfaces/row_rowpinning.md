---
id: Row_RowPinning
title: Row_RowPinning
---

# Interface: Row\_RowPinning

## Properties

### getCanPin()

```ts
getCanPin: () => boolean;
```

Returns whether or not the row can be pinned.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getcanpin-1)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:50](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L50)

***

### getIsPinned()

```ts
getIsPinned: () => RowPinningPosition;
```

Returns the pinned position of the row. (`'top'`, `'bottom'` or `false`)

#### Returns

[`RowPinningPosition`](../type-aliases/rowpinningposition.md)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getispinned-1)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:56](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L56)

***

### getPinnedIndex()

```ts
getPinnedIndex: () => number;
```

Returns the numeric pinned index of the row within a pinned row group.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#getpinnedindex-1)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:62](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L62)

***

### pin()

```ts
pin: (position, includeLeafRows?, includeParentRows?) => void;
```

Pins a row to the `'top'` or `'bottom'`, or unpins the row to the center if `false` is passed.

#### Parameters

• **position**: [`RowPinningPosition`](../type-aliases/rowpinningposition.md)

• **includeLeafRows?**: `boolean`

• **includeParentRows?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#pin-1)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:68](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L68)
