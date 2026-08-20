---
id: TableOptions_CellSelection
title: TableOptions_CellSelection
---

# Interface: TableOptions\_CellSelection\<TFeatures, TData\>

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L89)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### autoResetCellSelection?

```ts
optional autoResetCellSelection: boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L102)

Resets cell selection to `initialState.cellSelection` whenever `data`
changes. Defaults to `true`.

Ranges are stored as row and column ids, so new data would otherwise leave
a selection pointing at rows that no longer exist, or silently re-select
cells if the new data happens to reuse ids. Set to `false` to keep ranges
across data changes, and note `autoResetAll` overrides this.

***

### enableCellRangeSelection?

```ts
optional enableCellRangeSelection: boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L107)

Enables inclusive cell range selection through shift-click and drag.
Defaults to `true`.

***

### enableCellSelection?

```ts
optional enableCellSelection: boolean | (cell) => boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L114)

Allows cells to be selected.

Provide a predicate to decide per cell. A column def may also opt out with
its own `enableCellSelection: false`. Defaults to `true`.

***

### enableCellSelectionDrag?

```ts
optional enableCellSelectionDrag: boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L119)

Enables extending a selection by dragging across cells. Defaults to `true`.

***

### enableMultiCellRangeSelection?

```ts
optional enableMultiCellRangeSelection: boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L123)

Allows modifier interactions to add or subtract ranges. Defaults to `true`.

***

### isCellRangeSelectionEvent()?

```ts
optional isCellRangeSelectionEvent: (event) => boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L131)

Determines whether a selection-start event should extend the active range
instead of replacing the selection.

By default, events with `shiftKey` directly on the event or on
`event.nativeEvent` are treated as range-selection events.

#### Parameters

##### event

`unknown`

#### Returns

`boolean`

***

### isMultiCellRangeSelectionEvent()?

```ts
optional isMultiCellRangeSelectionEvent: (event) => boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L139)

Determines whether a selection-start event should add or subtract a new
rectangle. The operation depends on whether the starting cell is selected.

By default, events with `ctrlKey` or `metaKey` directly on the event or on
`event.nativeEvent` are treated as multi-range events.

#### Parameters

##### event

`unknown`

#### Returns

`boolean`

***

### onCellSelectionChange?

```ts
optional onCellSelectionChange: OnChangeFn<CellSelectionState>;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:148](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L148)

Called with an updater when cell selection state changes. Pair this with
`state.cellSelection` when using external state; external atoms can own the
slice without this callback.

A drag emits one change per cell crossed. Subscribe to
`table.atoms.cellSelection` for finer-grained reads when that matters.
