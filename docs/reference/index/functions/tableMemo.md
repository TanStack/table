---
id: tableMemo
title: tableMemo
---

# Function: tableMemo()

```ts
function tableMemo<TFeatures, TResult>(__namedParameters): () => TResult;
```

Defined in: [utils.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L180)

Creates a table-aware memoized function.

The native readonly atom is created on the first public read so eager
framework computeds cannot evaluate during incomplete table construction.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TResult

`TResult`

## Parameters

### \_\_namedParameters

`TableMemoOptions`\<`TFeatures`, `TResult`\>

## Returns

```ts
(): TResult;
```

### Returns

`TResult`
