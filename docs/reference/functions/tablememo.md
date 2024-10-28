---
id: tableMemo
title: tableMemo
---

# Function: tableMemo()

```ts
function tableMemo<TDeps, TDepArgs, TResult>(__namedParameters): (depArgs?) => TResult
```

## Type Parameters

• **TDeps** *extends* readonly `any`[]

• **TDepArgs**

• **TResult**

## Parameters

• **\_\_namedParameters**: `TableMemoOptions`\<`TDeps`, `TDepArgs`, `TResult`\>

## Returns

`Function`

### Parameters

• **depArgs?**: `TDepArgs`

### Returns

`TResult`

## Defined in

[utils.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L126)
