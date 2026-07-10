---
id: ColumnOffsets
title: ColumnOffsets
---

# Interface: ColumnOffsets

Defined in: [features/column-sizing/columnSizingFeature.types.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L10)

## Properties

### afters

```ts
afters: Record<string, number>;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L20)

Offset from the end edge of the region to each column's end edge, keyed by
column id.

***

### starts

```ts
starts: Record<string, number>;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L15)

Offset from the start edge of the region to each column's start edge,
keyed by column id.
