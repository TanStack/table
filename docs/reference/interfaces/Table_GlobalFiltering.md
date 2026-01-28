---
id: Table_GlobalFiltering
title: Table_GlobalFiltering
---

# Interface: Table\_GlobalFiltering\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L64)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getGlobalAutoFilterFn()

```ts
getGlobalAutoFilterFn: () => FilterFn<TFeatures, TData> | undefined;
```

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L71)

Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### getGlobalFilterFn()

```ts
getGlobalFilterFn: () => FilterFn<TFeatures, TData> | undefined;
```

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L75)

Returns the filter function (either user-defined or automatic, depending on configuration) for the global filter.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### resetGlobalFilter()

```ts
resetGlobalFilter: (defaultState?) => void;
```

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L79)

Resets the **globalFilter** state to `initialState.globalFilter`, or `true` can be passed to force a default blank state reset to `undefined`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setGlobalFilter()

```ts
setGlobalFilter: (updater) => void;
```

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L83)

Sets or updates the `state.globalFilter` state.

#### Parameters

##### updater

`any`

#### Returns

`void`
