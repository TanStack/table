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

Defined in: [helpers/tableOptions.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L10)

Returns table options while preserving generic inference.

This helper is useful when composing reusable table options outside of a framework adapter call.

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

Defined in: [helpers/tableOptions.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L24)

Returns table options while preserving generic inference when `data` is supplied later.

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

Defined in: [helpers/tableOptions.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L38)

Returns table options while preserving generic inference when both `data` and `columns` are supplied later.

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

Defined in: [helpers/tableOptions.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L52)

Returns a fully specified table options object without changing its runtime value.

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

Defined in: [helpers/tableOptions.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L60)

Returns table options while preserving generic inference when `_features` is supplied by a wrapper.

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

Defined in: [helpers/tableOptions.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L70)

Returns table options while preserving generic inference when `data` and `_features` are supplied by a wrapper.

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

Defined in: [helpers/tableOptions.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L80)

Returns table options while preserving generic inference when `columns` and `_features` are supplied by a wrapper.

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

Defined in: [helpers/tableOptions.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableOptions.ts#L90)

Returns table options while preserving generic inference when `data`, `columns`, and `_features` are supplied by a wrapper.

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
