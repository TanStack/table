---
id: assignAPIs
title: assignAPIs
---

# Function: assignAPIs()

```ts
function assignAPIs<TFeatures, TData, TObject, TDeps, TDepArgs>(obj, apis): void
```

Takes a static function, looks at its name and assigns it to an object with optional memoization and debugging.

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TObject** *extends* `Record`\<`string`, `any`\>

• **TDeps** *extends* readonly `any`[]

• **TDepArgs**

## Parameters

• **obj**: `TObject` *extends* `Record`\<`string`, `U`\> ? `U` : `never`

• **apis**: `API`\<`TDeps`, [`NoInfer`](../type-aliases/noinfer.md)\<`TDepArgs`\>\>[]

## Returns

`void`

## Defined in

[utils.ts:201](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L201)
