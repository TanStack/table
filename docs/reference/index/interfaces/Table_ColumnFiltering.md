---
id: Table_ColumnFiltering
title: Table_ColumnFiltering
---

# Interface: Table\_ColumnFiltering

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:216](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L216)

## Properties

### resetColumnFilters()

```ts
resetColumnFilters: (defaultState?) => void;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:222](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L222)

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

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:226](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L226)

Updates column filter state with a next array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnFiltersState`](../type-aliases/ColumnFiltersState.md)\>

#### Returns

`void`
