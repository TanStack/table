---
id: Column_ColumnPinning
title: Column_ColumnPinning
---

# Interface: Column\_ColumnPinning

## Properties

### getCanPin()

```ts
getCanPin: () => boolean;
```

Returns whether or not the column can be pinned.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcanpin)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:60](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L60)

***

### getIsPinned()

```ts
getIsPinned: () => ColumnPinningPosition;
```

Returns the pinned position of the column. (`'left'`, `'right'` or `false`)

#### Returns

[`ColumnPinningPosition`](../type-aliases/columnpinningposition.md)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getispinned)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:66](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L66)

***

### getPinnedIndex()

```ts
getPinnedIndex: () => number;
```

Returns the numeric pinned index of the column within a pinned column group.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getpinnedindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:72](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L72)

***

### pin()

```ts
pin: (position) => void;
```

Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.

#### Parameters

• **position**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md)

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#pin)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:78](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L78)
