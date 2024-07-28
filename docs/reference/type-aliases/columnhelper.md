---
id: ColumnHelper
title: ColumnHelper
---

# Type Alias: ColumnHelper\<TFeatures, TData\>

```ts
type ColumnHelper<TFeatures, TData>: object;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Type declaration

### accessor()

```ts
accessor: <TAccessor, TValue>(accessor, column) => TAccessor extends AccessorFn<TData> ? AccessorFnColumnDef<TFeatures, TData, TValue> : AccessorKeyColumnDef<TFeatures, TData, TValue>;
```

#### Type Parameters

• **TAccessor** *extends* [`AccessorFn`](accessorfn.md)\<`TData`\> \| [`DeepKeys`](deepkeys.md)\<`TData`\>

• **TValue** *extends* `TAccessor` *extends* [`AccessorFn`](accessorfn.md)\<`TData`, infer TReturn\> ? `TReturn` : `TAccessor` *extends* [`DeepKeys`](deepkeys.md)\<`TData`\> ? [`DeepValue`](deepvalue.md)\<`TData`, `TAccessor`\> : `never`

#### Parameters

• **accessor**: `TAccessor`

• **column**: `TAccessor` *extends* [`AccessorFn`](accessorfn.md)\<`TData`\> ? [`DisplayColumnDef`](displaycolumndef.md)\<`TFeatures`, `TData`, `TValue`\> : [`IdentifiedColumnDef`](identifiedcolumndef.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`TAccessor` *extends* [`AccessorFn`](accessorfn.md)\<`TData`\> ? [`AccessorFnColumnDef`](accessorfncolumndef.md)\<`TFeatures`, `TData`, `TValue`\> : [`AccessorKeyColumnDef`](accessorkeycolumndef.md)\<`TFeatures`, `TData`, `TValue`\>

### display()

```ts
display: (column) => DisplayColumnDef<TFeatures, TData, unknown>;
```

#### Parameters

• **column**: [`DisplayColumnDef`](displaycolumndef.md)\<`TFeatures`, `TData`\>

#### Returns

[`DisplayColumnDef`](displaycolumndef.md)\<`TFeatures`, `TData`, `unknown`\>

### group()

```ts
group: (column) => GroupColumnDef<TFeatures, TData, unknown>;
```

#### Parameters

• **column**: [`GroupColumnDef`](groupcolumndef.md)\<`TFeatures`, `TData`, `unknown`\>

#### Returns

[`GroupColumnDef`](groupcolumndef.md)\<`TFeatures`, `TData`, `unknown`\>

## Defined in

[helpers/columnHelper.ts:12](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/columnHelper.ts#L12)
