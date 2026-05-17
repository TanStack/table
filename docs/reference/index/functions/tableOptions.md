---
id: tableOptions
title: tableOptions
---

# Function: tableOptions()

Runtime implementation for `tableOptions`.

The helper returns the same object it receives; all value comes from the
overloads preserving table option inference at compile time.

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features" | "columns"> & object;
```

Defined in: [helpers/tableOptions.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L11)

Preserves table option inference when reusable options omit `columns`.

This is useful for composing shared options that will receive columns later
from a framework adapter or table factory.

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

Defined in: [helpers/tableOptions.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L25)

Preserves table option inference when reusable options omit `data`.

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
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features" | "data" | "columns"> & object;
```

Defined in: [helpers/tableOptions.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L40)

Preserves table option inference when reusable options omit both `data` and
`columns`.

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
function tableOptions<TFeatures, TData>(options): TableOptions<TFeatures, TData>;
```

Defined in: [helpers/tableOptions.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L54)

Preserves inference for a fully specified table options object.

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

## Call Signature

```ts
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "_features">;
```

Defined in: [helpers/tableOptions.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L62)

Preserves inference when a wrapper supplies `_features`.

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
function tableOptions<TFeatures, TData>(options): Omit<TableOptions<TFeatures, TData>, "data" | "_features">;
```

Defined in: [helpers/tableOptions.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L72)

Preserves inference when a wrapper supplies both `data` and `_features`.

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

Defined in: [helpers/tableOptions.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L82)

Preserves inference when a wrapper supplies both `columns` and `_features`.

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

Defined in: [helpers/tableOptions.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L93)

Preserves inference when a wrapper supplies `data`, `columns`, and
`_features`.

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
