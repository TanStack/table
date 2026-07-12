---
id: Table_ColumnFiltering
title: Table_ColumnFiltering
---

# Interface: Table\_ColumnFiltering

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:276](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L276)

## Properties

### resetColumnFilters()

```ts
resetColumnFilters: (defaultState?) => void;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:282](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L282)

Resets `columnFilters` to `initialState.columnFilters`.

Pass `true` to ignore initial state and reset to `[]`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setColumnFilters()

```ts
setColumnFilters: (updater) => void;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:286](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L286)

Updates column filter state with a next array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnFiltersState`](../type-aliases/ColumnFiltersState.md)\>

#### Returns

`void`
