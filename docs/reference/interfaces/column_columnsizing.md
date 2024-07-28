---
id: Column_ColumnSizing
title: Column_ColumnSizing
---

# Interface: Column\_ColumnSizing

## Properties

### getAfter()

```ts
getAfter: (position?) => number;
```

Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all succeeding (right) headers in relation to the current column.

#### Parameters

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `"center"`

#### Returns

`number`

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:88](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L88)

***

### getSize()

```ts
getSize: () => number;
```

Returns the current size of the column.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getsize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:94](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L94)

***

### getStart()

```ts
getStart: (position?) => number;
```

Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding (left) headers in relation to the current column.

#### Parameters

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `"center"`

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getstart)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:100](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L100)

***

### resetSize()

```ts
resetSize: () => void;
```

Resets the column to its initial size.

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#resetsize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:106](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L106)
