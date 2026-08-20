---
id: ColumnIndexes
title: ColumnIndexes
---

# Interface: ColumnIndexes

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:7](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L7)

## Properties

### all

```ts
all: Record<string, number>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L11)

Maps each visible leaf column id to its index in the full visible column list.

***

### center

```ts
center: Record<string, number>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L15)

Maps each unpinned visible leaf column id to its index within the center region.

***

### end

```ts
end: Record<string, number>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L23)

Maps each end-pinned visible leaf column id to its index within the end region.

***

### start

```ts
start: Record<string, number>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L19)

Maps each start-pinned visible leaf column id to its index within the start region.
