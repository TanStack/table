---
id: Table_GlobalFaceting
title: Table_GlobalFaceting
---

# Interface: Table\_GlobalFaceting\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getGlobalFacetedMinMaxValues()

```ts
getGlobalFacetedMinMaxValues: () => undefined | [number, number];
```

Returns the min and max values for the global filter.

#### Returns

`undefined` \| [`number`, `number`]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting#getglobalfacetedminmaxvalues)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)

#### Defined in

[features/global-faceting/GlobalFaceting.types.ts:14](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-faceting/GlobalFaceting.types.ts#L14)

***

### getGlobalFacetedRowModel()

```ts
getGlobalFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table after **global** filtering has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting#getglobalfacetedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)

#### Defined in

[features/global-faceting/GlobalFaceting.types.ts:20](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-faceting/GlobalFaceting.types.ts#L20)

***

### getGlobalFacetedUniqueValues()

```ts
getGlobalFacetedUniqueValues: () => Map<any, number>;
```

Returns the faceted unique values for the global filter.

#### Returns

`Map`\<`any`, `number`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting#getglobalfaceteduniquevalues)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)

#### Defined in

[features/global-faceting/GlobalFaceting.types.ts:26](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-faceting/GlobalFaceting.types.ts#L26)
