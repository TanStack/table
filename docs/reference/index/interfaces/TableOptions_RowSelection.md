---
id: TableOptions_RowSelection
title: TableOptions_RowSelection
---

# Interface: TableOptions\_RowSelection\<TFeatures, TData\>

Defined in: [features/row-selection/rowSelectionFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L34)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableMultiRowSelection?

```ts
optional enableMultiRowSelection: boolean | (row) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L48)

Allows rows to be selected alongside other rows.

Provide a predicate to decide per row. Defaults to `true`.

***

### enableRowRangeSelection?

```ts
optional enableRowRangeSelection: boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L42)

Enables inclusive row range selection through
`row.getToggleSelectedHandler()`. Defaults to `true`.

***

### enableRowSelection?

```ts
optional enableRowSelection: boolean | (row) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L54)

Allows rows to be selected.

Provide a predicate to decide per row. Defaults to `true`.

***

### enableSubRowSelection?

```ts
optional enableSubRowSelection: boolean | (row) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L62)

Controls whether selecting a parent row also selects its subRows.

Provide a predicate to decide per row. This is most useful with expanding or
grouping features and defaults to `true`. Select-all and the all-selected
getters also skip descendants of parents that block sub-row selection.

***

### isRowRangeSelectionEvent()?

```ts
optional isRowRangeSelectionEvent: (event) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L70)

Determines whether a row-selection handler event should select or
deselect the inclusive range from the most recent handler interaction.

By default, events with `shiftKey` directly on the event or on
`event.nativeEvent` are treated as range-selection events.

#### Parameters

##### event

`unknown`

#### Returns

`boolean`

***

### onRowSelectionChange?

```ts
optional onRowSelectionChange: OnChangeFn<RowSelectionState>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L76)

Called with an updater when row selection state changes. Pair this with
`state.rowSelection` when using external state; external atoms can own the
slice without this callback.
