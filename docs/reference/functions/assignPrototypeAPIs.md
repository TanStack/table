---
id: assignPrototypeAPIs
title: assignPrototypeAPIs
---

# Function: assignPrototypeAPIs()

```ts
function assignPrototypeAPIs<TFeatures, TData, TDeps, TDepArgs>(
   feature, 
   prototype, 
   table, 
   apis): void;
```

Defined in: [utils.ts:339](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L339)

Assigns API methods to a prototype object for memory-efficient method sharing.
All instances created with this prototype will share the same method references.

For memoized methods, the memo state is lazily created and stored on each instance.
This provides the best of both worlds: shared method code + per-instance caching.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TDeps

`TDeps` *extends* readonly `any`[]

### TDepArgs

`TDepArgs`

## Parameters

### feature

keyof `TFeatures` & `string`

### prototype

`Record`\<`string`, `any`\>

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### apis

[`PrototypeAPIObject`](../type-aliases/PrototypeAPIObject.md)\<`TDeps`, [`NoInfer`](../type-aliases/NoInfer.md)\<`TDepArgs`\>\>

## Returns

`void`
