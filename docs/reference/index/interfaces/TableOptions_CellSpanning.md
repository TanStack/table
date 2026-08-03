---
id: TableOptions_CellSpanning
title: TableOptions_CellSpanning
---

# Interface: TableOptions\_CellSpanning

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L131)

## Properties

### enableCellSpanning?

```ts
optional enableCellSpanning: boolean;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L136)

Allows cells to span rows or columns. When `false` every cell reports a
span of `1` and the span index is never built. Defaults to `true`.
