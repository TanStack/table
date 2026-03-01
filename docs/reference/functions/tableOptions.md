---
id: tableOptions
title: tableOptions
---

# Function: tableOptions()

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features" | "columns"> & object;
```

Defined in: [helpers/tableOptions.ts:5](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L5)

### Type Parameters

#### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

#### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### Parameters

#### options

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"columns"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"_features"` \| `"columns"`\> & `object`

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features" | "data"> & object;
```

Defined in: [helpers/tableOptions.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L16)

### Type Parameters

#### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

#### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### Parameters

#### options

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"data"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"_features"` \| `"data"`\> & `object`

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features">;
```

Defined in: [helpers/tableOptions.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L27)

### Type Parameters

#### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

#### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### Parameters

#### options

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"_features"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"_features"`\>

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features" | "data" | "columns"> & object;
```

Defined in: [helpers/tableOptions.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L34)

### Type Parameters

#### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

#### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### Parameters

#### options

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"columns"`\> & `object`

### Returns

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"_features"` \| `"data"` \| `"columns"`\> & `object`

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "_features">;
```

Defined in: [helpers/tableOptions.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L45)

### Type Parameters

#### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

#### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### Parameters

#### options

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"_features"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"_features"`\>

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "columns" | "_features">;
```

Defined in: [helpers/tableOptions.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L52)

### Type Parameters

#### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

#### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### Parameters

#### options

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"columns"` \| `"_features"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"columns"` \| `"_features"`\>

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "columns" | "_features">;
```

Defined in: [helpers/tableOptions.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L59)

### Type Parameters

#### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

#### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### Parameters

#### options

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"columns"` \| `"_features"`\>

### Returns

`Omit`\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>, `"data"` \| `"columns"` \| `"_features"`\>

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): TableOptions<TFeatures, TData>;
```

Defined in: [helpers/tableOptions.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L69)

### Type Parameters

#### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

#### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### Parameters

#### options

[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>

### Returns

[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>
