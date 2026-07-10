---
id: ColumnOffsetsByPosition
title: ColumnOffsetsByPosition
---

# Interface: ColumnOffsetsByPosition

Defined in: [features/column-sizing/columnSizingFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L23)

## Properties

### all

```ts
all: ColumnOffsets;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L27)

Offsets across all visible leaf columns, ignoring pinning regions.

***

### center

```ts
center: ColumnOffsets;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L31)

Offsets within the center (unpinned) region.

***

### end

```ts
end: ColumnOffsets;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L45)

Offsets within the logical end pinned region.

In LTR languages/layouts, end usually corresponds to right. In RTL
languages/layouts, end usually corresponds to left.

***

### start

```ts
start: ColumnOffsets;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L38)

Offsets within the logical start pinned region.

In LTR languages/layouts, start usually corresponds to left. In RTL
languages/layouts, start usually corresponds to right.
