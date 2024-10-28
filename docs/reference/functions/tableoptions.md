---
id: tableOptions
title: tableOptions
---

# Function: tableOptions()

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "columns" | "_features"> & object
```

### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md) = `any`

### Parameters

• **options**: `Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"columns"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"columns"` \| `"_features"`\> & `object`

### Defined in

[helpers/tableOptions.ts:5](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L5)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "_features"> & object
```

### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md) = `any`

### Parameters

• **options**: `Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"_features"`\> & `object`

### Defined in

[helpers/tableOptions.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L16)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features">
```

### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md) = `any`

### Parameters

• **options**: `Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"_features"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"_features"`\>

### Defined in

[helpers/tableOptions.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L27)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "columns" | "_features"> & object
```

### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md) = `any`

### Parameters

• **options**: `Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"columns"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"columns"` \| `"_features"`\> & `object`

### Defined in

[helpers/tableOptions.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L34)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "_features">
```

### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md) = `any`

### Parameters

• **options**: `Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"_features"` \| `"data"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"_features"`\>

### Defined in

[helpers/tableOptions.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L45)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "columns" | "_features">
```

### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md) = `any`

### Parameters

• **options**: `Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"_features"` \| `"columns"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"columns"` \| `"_features"`\>

### Defined in

[helpers/tableOptions.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L52)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "columns" | "_features">
```

### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md) = `any`

### Parameters

• **options**: `Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"_features"` \| `"data"` \| `"columns"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"columns"` \| `"_features"`\>

### Defined in

[helpers/tableOptions.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L59)

## tableOptions(options)

```ts
function tableOptions<TFeatures, TData>(options): TableOptions<TFeatures, TData>
```

### Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md) = `any`

### Parameters

• **options**: [`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>

### Returns

[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>

### Defined in

[helpers/tableOptions.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L69)
