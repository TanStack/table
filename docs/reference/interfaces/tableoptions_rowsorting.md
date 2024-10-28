---
id: TableOptions_RowSorting
title: TableOptions_RowSorting
---

# Interface: TableOptions\_RowSorting

## Properties

### enableMultiRemove?

```ts
optional enableMultiRemove: boolean;
```

Enables/disables the ability to remove multi-sorts

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultiremove)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:185](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L185)

***

### enableMultiSort?

```ts
optional enableMultiSort: boolean;
```

Enables/Disables multi-sorting for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultisort)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L191)

***

### enableSorting?

```ts
optional enableSorting: boolean;
```

Enables/Disables sorting for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:197](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L197)

***

### enableSortingRemoval?

```ts
optional enableSortingRemoval: boolean;
```

Enables/Disables the ability to remove sorting for the table.
- If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesortingremoval)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:205](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L205)

***

### isMultiSortEvent()?

```ts
optional isMultiSortEvent: (e) => boolean;
```

Pass a custom function that will be used to determine if a multi-sort event should be triggered. It is passed the event from the sort toggle handler and should return `true` if the event should trigger a multi-sort.

#### Parameters

• **e**: `unknown`

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#ismultisortevent)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:211](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L211)

***

### manualSorting?

```ts
optional manualSorting: boolean;
```

Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#manualsorting)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:217](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L217)

***

### maxMultiSortColCount?

```ts
optional maxMultiSortColCount: number;
```

Set a maximum number of columns that can be multi-sorted.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#maxmultisortcolcount)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:223](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L223)

***

### onSortingChange?

```ts
optional onSortingChange: OnChangeFn<SortingState>;
```

If provided, this function will be called with an `updaterFn` when `state.sorting` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#onsortingchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:229](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L229)

***

### sortDescFirst?

```ts
optional sortDescFirst: boolean;
```

If `true`, all sorts will default to descending as their first toggle state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortdescfirst)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/sorting)

#### Defined in

[features/row-sorting/RowSorting.types.ts:235](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L235)
