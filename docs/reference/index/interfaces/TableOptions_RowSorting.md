---
id: TableOptions_RowSorting
title: TableOptions_RowSorting
---

# Interface: TableOptions\_RowSorting

Defined in: [features/row-sorting/rowSortingFeature.types.ts:216](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L216)

## Properties

### autoResetSorting?

```ts
optional autoResetSorting: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:223](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L223)

Resets sorting to its initial state when the `data` option changes.

This is disabled by default. `autoResetAll` overrides this option when it
is explicitly set.

***

### enableMultiRemove?

```ts
optional enableMultiRemove: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:227](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L227)

Allows multi-sort toggles to remove a column from sorting state.

***

### enableMultiSort?

```ts
optional enableMultiSort: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:231](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L231)

Enables/Disables multi-sorting for the table.

***

### enableSorting?

```ts
optional enableSorting: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:235](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L235)

Enables/Disables sorting for the table.

***

### enableSortingRemoval?

```ts
optional enableSortingRemoval: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:241](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L241)

Enables/Disables the ability to remove sorting for the table.
- If `true` then changing sort order will cycle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- If `false` then changing sort order will cycle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

***

### isMultiSortEvent()?

```ts
optional isMultiSortEvent: (e) => boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:245](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L245)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:249](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L249)

Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.

***

### maxMultiSortColCount?

```ts
optional maxMultiSortColCount: number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:253](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L253)

Set a maximum number of columns that can be multi-sorted.

***

### onSortingChange?

```ts
optional onSortingChange: OnChangeFn<SortingState>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:259](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L259)

Called with an updater when sorting state changes. Pair this with
`state.sorting` when using external state; external atoms can own the slice
without this callback.

***

### sortDescFirst?

```ts
optional sortDescFirst: boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:263](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L263)

If `true`, all sorts will default to descending as their first toggle state.
