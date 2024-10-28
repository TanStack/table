---
id: CachedRowModel_Faceted
title: CachedRowModel_Faceted
---

# Interface: CachedRowModel\_Faceted\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### facetedMinMaxValues()?

```ts
optional facetedMinMaxValues: (columnId) => [number, number];
```

#### Parameters

• **columnId**: `string`

#### Returns

[`number`, `number`]

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L76)

***

### facetedRowModel()?

```ts
optional facetedRowModel: (columnId) => () => RowModel<TFeatures, TData>;
```

#### Parameters

• **columnId**: `string`

#### Returns

`Function`

##### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L75)

***

### facetedUniqueValues()?

```ts
optional facetedUniqueValues: (columnId) => Map<any, number>;
```

#### Parameters

• **columnId**: `string`

#### Returns

`Map`\<`any`, `number`\>

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L77)
