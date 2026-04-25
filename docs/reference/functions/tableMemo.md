---
id: tableMemo
title: tableMemo
---

# Function: tableMemo()

```ts
function tableMemo<TFeatures, TDeps, TDepArgs, TResult>(__namedParameters): (depArgs?) => TResult;
```

Defined in: [utils.ts:167](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L167)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TDeps

`TDeps` *extends* readonly `any`[]

### TDepArgs

`TDepArgs`

### TResult

`TResult`

## Parameters

### \_\_namedParameters

`TableMemoOptions`\<`TFeatures`, `TDeps`, `TDepArgs`, `TResult`\>

## Returns

```ts
(depArgs?): TResult;
```

### Parameters

#### depArgs?

`TDepArgs`

### Returns

`TResult`
