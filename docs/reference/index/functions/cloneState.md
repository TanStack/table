---
id: cloneState
title: cloneState
---

# Function: cloneState()

```ts
function cloneState<T>(value): T;
```

Defined in: [utils.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L22)

Clones table state values while preserving non-plain objects.

Plain objects and arrays are copied recursively so state updates can avoid mutating existing references.

## Type Parameters

### T

`T`

## Parameters

### value

`T`

## Returns

`T`
