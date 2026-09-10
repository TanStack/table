---
id: CellSelectionRange
title: CellSelectionRange
---

# Interface: CellSelectionRange

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L19)

A single rectangular cell selection, stored as its two defining corners.

The `anchor` corner stays put while the `focus` corner moves during a
shift-extend or a drag, so the pair carries strictly more information than a
normalized min/max rectangle would. Corners are stored as flat row and column
ids rather than nested objects or a packed `rowId_columnId` key, because
`getRowId` is user-supplied and may return ids containing any separator.

## Properties

### anchorColumnId

```ts
anchorColumnId: string;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L20)

***

### anchorRowId

```ts
anchorRowId: string;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L21)

***

### focusColumnId

```ts
focusColumnId: string;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L22)

***

### focusRowId

```ts
focusRowId: string;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L23)

***

### operation?

```ts
optional operation: CellSelectionRangeOperation;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L28)

How this range changes the selection produced by the ranges before it.
Defaults to `include`.
