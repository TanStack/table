---
id: TableOptions_RowSorting
title: TableOptions_RowSorting
---

# Interface: TableOptions\_RowSorting

Defined in: [features/row-sorting/rowSortingFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L143)

## Properties

### enableMultiRemove?

```ts
optional enableMultiRemove: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L147)

Enables/disables the ability to remove multi-sorts

***

### enableMultiSort?

```ts
optional enableMultiSort: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L151)

Enables/Disables multi-sorting for the table.

***

### enableSorting?

```ts
optional enableSorting: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L155)

Enables/Disables sorting for the table.

***

### enableSortingRemoval?

```ts
optional enableSortingRemoval: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L161)

Enables/Disables the ability to remove sorting for the table.
- If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

***

### isMultiSortEvent()?

```ts
optional isMultiSortEvent: (e) => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:165](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L165)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:169](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L169)

Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.

***

### maxMultiSortColCount?

```ts
optional maxMultiSortColCount: number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L173)

Set a maximum number of columns that can be multi-sorted.

***

### onSortingChange?

```ts
optional onSortingChange: OnChangeFn<SortingState>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L177)

If provided, this function will be called with an `updaterFn` when `state.sorting` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

***

### sortDescFirst?

```ts
optional sortDescFirst: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:181](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L181)

If `true`, all sorts will default to descending as their first toggle state.
