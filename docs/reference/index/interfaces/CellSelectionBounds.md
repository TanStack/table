---
id: CellSelectionBounds
title: CellSelectionBounds
---

# Interface: CellSelectionBounds

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L53)

A range resolved into inclusive display-order indexes.

Ranges whose corners no longer resolve are omitted rather than clamped, so a
range with a filtered-out corner contributes nothing while remaining in state.

## Properties

### maxColumnIndex

```ts
maxColumnIndex: number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L54)

***

### maxRowIndex

```ts
maxRowIndex: number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L55)

***

### minColumnIndex

```ts
minColumnIndex: number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L56)

***

### minRowIndex

```ts
minRowIndex: number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L57)
