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

Defined in: [features/column-sizing/columnSizingFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L39)

Offsets within the end pinned region.

***

### start

```ts
start: ColumnOffsets;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L35)

Offsets within the start pinned region.
