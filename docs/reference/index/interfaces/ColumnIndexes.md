---
id: ColumnIndexes
title: ColumnIndexes
---

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L8)

## Properties

### all

```ts
all: Record<string, number>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L12)

Maps each visible leaf column id to its index in the full visible column list.

***

### center

```ts
center: Record<string, number>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L16)

Maps each unpinned visible leaf column id to its index within the center region.

***

### end

```ts
end: Record<string, number>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L24)

Maps each end-pinned visible leaf column id to its index within the end region.

***

### start

```ts
start: Record<string, number>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L20)

Maps each start-pinned visible leaf column id to its index within the start region.
