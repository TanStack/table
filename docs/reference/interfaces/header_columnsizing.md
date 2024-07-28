---
id: Header_ColumnSizing
title: Header_ColumnSizing
---

# Interface: Header\_ColumnSizing

## Properties

### getSize()

```ts
getSize: () => number;
```

Returns the current size of the header.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getsize)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:115](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L115)

***

### getStart()

```ts
getStart: (position?) => number;
```

Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding headers.

#### Parameters

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md)

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#getstart)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:121](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L121)
