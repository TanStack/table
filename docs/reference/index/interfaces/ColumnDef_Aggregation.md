---
id: ColumnDef_Aggregation
title: ColumnDef_Aggregation
---

# Interface: ColumnDef\_Aggregation\<TFeatures, TData, TValue\>

Defined in: [features/aggregation/aggregationFeature.types.ts:233](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L233)

Column-definition options installed by `aggregationFeature`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### aggregatedCell?

```ts
optional aggregatedCell: ColumnDefTemplate<ReturnType<Cell<TFeatures, TData, TValue>["getContext"]>>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:239](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L239)

Renderer used for a grouped row's aggregated cell.

***

### aggregationFn?

```ts
optional aggregationFn: AggregationFnOption<TFeatures, TData, TValue>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:246](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L246)

One aggregation reference for a scalar result, or an array for a keyed
result object. Inline definitions in an array require an explicit `id`.

***

### getAggregationValue()?

```ts
optional getAggregationValue: (context) => 
  | AggregationValueResult<unknown>
  | undefined;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:258](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L258)

Optionally supplies a precomputed aggregation value for this column.
Return `{ value }` to handle the request, including `{ value: undefined }`;
return `undefined` to use the local aggregation fallback.

#### Parameters

##### context

[`AggregationValueContext`](AggregationValueContext.md)\<`TFeatures`, `TData`, `TValue`\>

#### Returns

  \| [`AggregationValueResult`](AggregationValueResult.md)\<`unknown`\>
  \| `undefined`

***

### maxAggregationDepth?

```ts
optional maxAggregationDepth: number;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:252](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L252)

Maximum relative sub-row depth used for grouped aggregation and cached
default totals. `0` selects the supplied root rows, `1` their direct
sub-rows, and so on. Defaults to `0`.
