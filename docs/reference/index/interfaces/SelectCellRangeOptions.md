---
id: SelectCellRangeOptions
title: SelectCellRangeOptions
---

# Interface: SelectCellRangeOptions

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L74)

## Properties

### ~~additive?~~

```ts
optional additive: boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L86)

Whether the range should be added alongside existing ranges rather than
replacing them. Defaults to `false`.

#### Deprecated

Use `mode: 'include'` instead.

***

### mode?

```ts
optional mode: CellSelectionRangeMode;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L79)

Whether to replace the selection, add the range, or subtract the range.
Defaults to `replace`.
