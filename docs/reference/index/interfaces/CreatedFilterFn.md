---
id: CreatedFilterFn
title: CreatedFilterFn
---

# Interface: CreatedFilterFn()\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L126)

The shape returned by `constructFilterFn`: a `FilterFn` with its definition
attached, so variants can be built by spreading it into another
`constructFilterFn` call.

The call signature is generic so a created filter function can be used with
any table's rows, regardless of the feature set it was defined against.

## Extends

- [`FilterFnDef`](FilterFnDef.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

```ts
CreatedFilterFn<TRowFeatures, TRowData>(
   row,
   columnId,
   filterValue,
   addMeta?): boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L130)

The shape returned by `constructFilterFn`: a `FilterFn` with its definition
attached, so variants can be built by spreading it into another
`constructFilterFn` call.

The call signature is generic so a created filter function can be used with
any table's rows, regardless of the feature set it was defined against.

## Type Parameters

### TRowFeatures

`TRowFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TRowData

`TRowData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TRowFeatures`, `TRowData`\>

### columnId

`string`

### filterValue

`any`

### addMeta?

(`meta`) => `void`

## Returns

`boolean`

## Properties

### autoRemove()?

```ts
optional autoRemove: (filterValue) => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L113)

#### Parameters

##### filterValue

`any`

#### Returns

`boolean`

#### Inherited from

[`FilterFnDef`](FilterFnDef.md).[`autoRemove`](FilterFnDef.md#autoremove)

***

### filter()

```ts
filter: (dataValue, filterValue, row, columnId, addMeta?) => boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L106)

#### Parameters

##### dataValue

`any`

##### filterValue

`any`

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

##### addMeta?

(`meta`) => `void`

#### Returns

`boolean`

#### Inherited from

[`FilterFnDef`](FilterFnDef.md).[`filter`](FilterFnDef.md#filter)

***

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L115)

#### Inherited from

[`FilterFnDef`](FilterFnDef.md).[`resolveDataValue`](FilterFnDef.md#resolvedatavalue)

***

### resolveFilterValue()?

```ts
optional resolveFilterValue: (filterValue) => any;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L114)

#### Parameters

##### filterValue

`any`

#### Returns

`any`

#### Inherited from

[`FilterFnDef`](FilterFnDef.md).[`resolveFilterValue`](FilterFnDef.md#resolvefiltervalue)
