---
id: TableOptions_RowSorting
title: TableOptions_RowSorting
---

# Interface: TableOptions\_RowSorting

Defined in: [features/row-sorting/rowSortingFeature.types.ts:158](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L158)

## Properties

### enableMultiRemove?

```ts
optional enableMultiRemove: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:162](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L162)

Allows multi-sort toggles to remove a column from sorting state.

***

### enableMultiSort?

```ts
optional enableMultiSort: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:166](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L166)

Enables/Disables multi-sorting for the table.

***

### enableSorting?

```ts
optional enableSorting: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:170](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L170)

Enables/Disables sorting for the table.

***

### enableSortingRemoval?

```ts
optional enableSortingRemoval: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:176](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L176)

Enables/Disables the ability to remove sorting for the table.
- If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

***

### isMultiSortEvent()?

```ts
optional isMultiSortEvent: (e) => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L180)

Pass a custom function that will be used to determine if a multi-sort event should be triggered. It is passed the event from the sort toggle handler and should return `true` if the event should trigger a multi-sort.

#### Parameters

##### e

`unknown`

#### Returns

`boolean`

***

### manualSorting?

```ts
optional manualSorting: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:184](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L184)

Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.

***

### maxMultiSortColCount?

```ts
optional maxMultiSortColCount: number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:188](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L188)

Set a maximum number of columns that can be multi-sorted.

***

### onSortingChange?

```ts
optional onSortingChange: OnChangeFn<SortingState>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:194](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L194)

Called with an updater when sorting state changes. Pair this with
`state.sorting` when using external state; external atoms can own the slice
without this callback.

***

### sortDescFirst?

```ts
optional sortDescFirst: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:198](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L198)

If `true`, all sorts will default to descending as their first toggle state.
