---
id: callMemoOrStaticFn
title: callMemoOrStaticFn
---

# Function: callMemoOrStaticFn()

```ts
function callMemoOrStaticFn<TObject, TArgs, TReturn>(
   obj,
   fnKey,
   staticFn, ...
   args): TReturn;
```

Defined in: [utils.ts:631](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L631)

Looks to run the memoized function with the builder pattern on the object if it exists, otherwise fall back to the static method passed in.

## Type Parameters

### TObject

`TObject` *extends* `Record`\<`string`, `any`\>

### TArgs

`TArgs` *extends* `any`[]

### TReturn

`TReturn`

## Parameters

### obj

`TObject`

### fnKey

`string`

### staticFn

(`obj`, ...`args`) => `TReturn`

### args

...`TArgs`

## Returns

`TReturn`
