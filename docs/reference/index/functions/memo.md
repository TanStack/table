---
id: memo
title: memo
---

# Function: memo()

```ts
function memo<TDeps, TDepArgs, TResult>(__namedParameters): (depArgs?) => TResult;
```

Defined in: [utils.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L113)

Creates a dependency-tracked memoized function for table internals.

The memo recomputes only when its dependency tuple changes and can emit debug timing information.

## Type Parameters

### TDeps

`TDeps` *extends* readonly `any`[]

### TDepArgs

`TDepArgs`

### TResult

`TResult`

## Parameters

### \_\_namedParameters

`MemoOptions`\<`TDeps`, `TDepArgs`, `TResult`\>

## Returns

```ts
(depArgs?): TResult;
```

### Parameters

#### depArgs?

`TDepArgs`

### Returns

`TResult`
