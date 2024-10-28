---
id: CreateRowModel_Faceted
title: CreateRowModel_Faceted
---

# Interface: CreateRowModel\_Faceted\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### facetedMinMaxValues()?

```ts
optional facetedMinMaxValues: (table, columnId) => () => undefined | [number, number];
```

This function is used to retrieve the faceted min/max values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedMinMaxValues()` from your adapter to your table or implement your own.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

#### Returns

`Function`

##### Returns

`undefined` \| [`number`, `number`]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedminmaxvalues)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L47)

***

### facetedRowModel()?

```ts
optional facetedRowModel: (table, columnId) => () => RowModel<TFeatures, TData>;
```

This function is used to retrieve the faceted row model. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedRowModel()` from your adapter to your table or implement your own.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

#### Returns

`Function`

##### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L56)

***

### facetedUniqueValues()?

```ts
optional facetedUniqueValues: (table, columnId) => () => Map<any, number>;
```

This function is used to retrieve the faceted unique values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedUniqueValues()` from your adapter to your table or implement your own.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

#### Returns

`Function`

##### Returns

`Map`\<`any`, `number`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfaceteduniquevalues)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L65)
