---
id: Table_GlobalFiltering
title: Table_GlobalFiltering
---

# Interface: Table\_GlobalFiltering\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getGlobalAutoFilterFn()

```ts
getGlobalAutoFilterFn: () => undefined | FilterFn<TFeatures, TData>;
```

Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.

#### Returns

`undefined` \| [`FilterFn`](filterfn.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getglobalautofilterfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:86](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L86)

***

### getGlobalFilterFn()

```ts
getGlobalFilterFn: () => undefined | FilterFn<TFeatures, TData>;
```

Returns the filter function (either user-defined or automatic, depending on configuration) for the global filter.

#### Returns

`undefined` \| [`FilterFn`](filterfn.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getglobalfilterfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:92](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L92)

***

### resetGlobalFilter()

```ts
resetGlobalFilter: (defaultState?) => void;
```

Resets the **globalFilter** state to `initialState.globalFilter`, or `true` can be passed to force a default blank state reset to `undefined`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#resetglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:98](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L98)

***

### setGlobalFilter()

```ts
setGlobalFilter: (updater) => void;
```

Sets or updates the `state.globalFilter` state.

#### Parameters

• **updater**: `any`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#setglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:104](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L104)
