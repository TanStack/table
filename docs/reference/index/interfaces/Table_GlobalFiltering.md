---
id: Table_GlobalFiltering
title: Table_GlobalFiltering
---

# Interface: Table\_GlobalFiltering\<TFeatures, TData\>

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L66)

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

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L73)

Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### getGlobalFilterFn()

```ts
getGlobalFilterFn: () => FilterFn<TFeatures, TData> | undefined;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L77)

Returns the filter function (either user-defined or automatic, depending on configuration) for the global filter.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### resetGlobalFilter()

```ts
resetGlobalFilter: (defaultState?) => void;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L81)

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

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L85)

Sets global filter state using a value or updater.

#### Parameters

##### updater

`any`

#### Returns

`void`
