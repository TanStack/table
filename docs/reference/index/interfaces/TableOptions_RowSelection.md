---
id: TableOptions_RowSelection
title: TableOptions_RowSelection
---

# Interface: TableOptions\_RowSelection\<TFeatures, TData\>

Defined in: [features/row-selection/rowSelectionFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L23)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L37)

Allows rows to be selected alongside other rows.

Provide a predicate to decide per row. Defaults to `true`.

***

### enableRowRangeSelection?

```ts
optional enableRowRangeSelection: boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L31)

Enables inclusive row range selection through
`row.getToggleSelectedHandler()`. Defaults to `true`.

***

### enableRowSelection?

```ts
optional enableRowSelection: boolean | (row) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L43)

Allows rows to be selected.

Provide a predicate to decide per row. Defaults to `true`.

***

### enableSubRowSelection?

```ts
optional enableSubRowSelection: boolean | (row) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L50)

Controls whether selecting a parent row also selects its subRows.

Provide a predicate to decide per row. This is most useful with expanding or
grouping features and defaults to `true`.

***

### isRowRangeSelectionEvent()?

```ts
optional isRowRangeSelectionEvent: (event) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L58)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L64)

Called with an updater when row selection state changes. Pair this with
`state.rowSelection` when using external state; external atoms can own the
slice without this callback.
