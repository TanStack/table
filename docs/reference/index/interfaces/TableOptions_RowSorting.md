---
id: TableOptions_RowSorting
title: TableOptions_RowSorting
---

# Interface: TableOptions\_RowSorting

Defined in: [features/row-sorting/rowSortingFeature.types.ts:210](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L210)

## Properties

### enableMultiRemove?

```ts
optional enableMultiRemove: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:214](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L214)

Allows multi-sort toggles to remove a column from sorting state.

***

### enableMultiSort?

```ts
optional enableMultiSort: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:218](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L218)

Enables/Disables multi-sorting for the table.

***

### enableSorting?

```ts
optional enableSorting: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:222](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L222)

Enables/Disables sorting for the table.

***

### enableSortingRemoval?

```ts
optional enableSortingRemoval: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:228](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L228)

Enables/Disables the ability to remove sorting for the table.
- If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

***

### isMultiSortEvent()?

```ts
optional isMultiSortEvent: (e) => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:232](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L232)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:236](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L236)

Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.

***

### maxMultiSortColCount?

```ts
optional maxMultiSortColCount: number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:240](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L240)

Set a maximum number of columns that can be multi-sorted.

***

### onSortingChange?

```ts
optional onSortingChange: OnChangeFn<SortingState>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:246](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L246)

Called with an updater when sorting state changes. Pair this with
`state.sorting` when using external state; external atoms can own the slice
without this callback.

***

### sortDescFirst?

```ts
optional sortDescFirst: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:250](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L250)

If `true`, all sorts will default to descending as their first toggle state.
