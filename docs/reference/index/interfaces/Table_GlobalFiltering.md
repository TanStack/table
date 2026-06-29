---
id: Table_GlobalFiltering
title: Table_GlobalFiltering
---

# Interface: Table\_GlobalFiltering\<TFeatures, TData\>

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L69)

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

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L76)

Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### getGlobalFilterFn()

```ts
getGlobalFilterFn: () => FilterFn<TFeatures, TData> | undefined;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L80)

Returns the filter function (either user-defined or automatic, depending on configuration) for the global filter.

#### Returns

[`FilterFn`](FilterFn.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### resetGlobalFilter()

```ts
resetGlobalFilter: (defaultState?) => void;
```

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L86)

Resets `globalFilter` to `initialState.globalFilter`.

Pass `true` to ignore initial state and reset to `undefined`.

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

Defined in: [features/global-filtering/globalFilteringFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L90)

Updates global filter state with a next value or updater function.

#### Parameters

##### updater

`any`

#### Returns

`void`
