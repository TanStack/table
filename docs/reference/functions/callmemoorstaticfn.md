---
id: callMemoOrStaticFn
title: callMemoOrStaticFn
---

# Function: callMemoOrStaticFn()

```ts
function callMemoOrStaticFn<TFeatures, TData>(
   obj, 
   staticFn, 
   args): any
```

Looks to run the memoized function with the builder pattern on the object if it exists, otherwise fallback to the static method passed in.

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **obj**: 
  \| [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>
  \| [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>
  \| [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`\>
  \| [`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`\>
  \| [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`\>

• **staticFn**: `AnyFunction`

• **args**: `any`[]

## Returns

`any`

## Defined in

[utils.ts:234](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L234)
