---
id: callMemoOrStaticFn
title: callMemoOrStaticFn
---

# Function: callMemoOrStaticFn()

```ts
function callMemoOrStaticFn<TObject, TStaticFn>(
   obj, 
   fnKey, 
   staticFn, ...
args): ReturnType<TStaticFn>;
```

Defined in: [utils.ts:406](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L406)

Looks to run the memoized function with the builder pattern on the object if it exists, otherwise fallback to the static method passed in.

## Type Parameters

### TObject

`TObject` *extends* `Record`\<`string`, `any`\>

### TStaticFn

`TStaticFn` *extends* `AnyFunction`

## Parameters

### obj

`TObject`

### fnKey

`string`

### staticFn

`TStaticFn`

### args

...`Parameters`\<`TStaticFn`\> *extends* \[`any`, `...Rest[]`\] ? `Rest` : `never`

## Returns

`ReturnType`\<`TStaticFn`\>
