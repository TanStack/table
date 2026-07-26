---
id: CellSelectionBounds
title: CellSelectionBounds
---

# Interface: CellSelectionBounds

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L46)

A range resolved into inclusive display-order indexes.

Ranges whose corners no longer resolve are omitted rather than clamped, so a
range with a filtered-out corner contributes nothing while remaining in state.

## Properties

### maxColumnIndex

```ts
maxColumnIndex: number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L47)

***

### maxRowIndex

```ts
maxRowIndex: number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L48)

***

### minColumnIndex

```ts
minColumnIndex: number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L49)

***

### minRowIndex

```ts
minRowIndex: number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L50)
