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

[features/column-pinning/ColumnPinning.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L53)

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

[features/column-pinning/ColumnPinning.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L59)

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

[features/column-pinning/ColumnPinning.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L65)

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

[features/column-pinning/ColumnPinning.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L71)
