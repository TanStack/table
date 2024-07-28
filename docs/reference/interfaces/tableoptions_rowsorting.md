---
id: TableOptions_RowSorting
title: TableOptions_RowSorting
---

# Interface: TableOptions\_RowSorting\<TFeatures, TData\>

## Extends

- `SortingOptionsBase`.`ResolvedSortingFns`\<`TFeatures`, `TData`\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

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

#### Inherited from

`SortingOptionsBase.enableMultiRemove`

#### Defined in

[features/row-sorting/RowSorting.types.ts:177](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L177)

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

#### Inherited from

`SortingOptionsBase.enableMultiSort`

#### Defined in

[features/row-sorting/RowSorting.types.ts:183](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L183)

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

#### Inherited from

`SortingOptionsBase.enableSorting`

#### Defined in

[features/row-sorting/RowSorting.types.ts:189](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L189)

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

#### Inherited from

`SortingOptionsBase.enableSortingRemoval`

#### Defined in

[features/row-sorting/RowSorting.types.ts:197](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L197)

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

#### Inherited from

`SortingOptionsBase.isMultiSortEvent`

#### Defined in

[features/row-sorting/RowSorting.types.ts:203](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L203)

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

#### Inherited from

`SortingOptionsBase.manualSorting`

#### Defined in

[features/row-sorting/RowSorting.types.ts:209](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L209)

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

#### Inherited from

`SortingOptionsBase.maxMultiSortColCount`

#### Defined in

[features/row-sorting/RowSorting.types.ts:215](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L215)

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

#### Inherited from

`SortingOptionsBase.onSortingChange`

#### Defined in

[features/row-sorting/RowSorting.types.ts:221](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L221)

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

#### Inherited from

`SortingOptionsBase.sortDescFirst`

#### Defined in

[features/row-sorting/RowSorting.types.ts:227](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L227)

***

### sortingFns?

```ts
optional sortingFns: Record<string, SortingFn<TFeatures, TData>>;
```

#### Inherited from

`ResolvedSortingFns.sortingFns`

#### Defined in

[features/row-sorting/RowSorting.types.ts:235](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L235)
