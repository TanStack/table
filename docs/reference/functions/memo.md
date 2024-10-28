---
id: memo
title: memo
---

# Function: memo()

```ts
function memo<TDeps, TDepArgs, TResult>(options): (depArgs?) => TResult
```

## Type Parameters

• **TDeps** *extends* readonly `any`[]

• **TDepArgs**

• **TResult**

## Parameters

• **options**: `MemoOptions`\<`TDeps`, `TDepArgs`, `TResult`\>

## Returns

`Function`

### Parameters

• **depArgs?**: `TDepArgs`

### Returns

`TResult`

## Defined in

[utils.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L74)
