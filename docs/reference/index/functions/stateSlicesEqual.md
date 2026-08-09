---
id: stateSlicesEqual
title: stateSlicesEqual
---

# Function: stateSlicesEqual()

```ts
function stateSlicesEqual(a, b): boolean;
```

Defined in: [utils.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L155)

Structurally compares two state slice values as deeply as stock feature
state can nest and no deeper.

Three container levels cover flat maps and arrays, arrays of state objects,
array-valued filter values, and `columnResizing.columnSizingStart` tuples.
Deeper containers and non-plain values compare by reference. A `false`
result is always safe: the state update simply proceeds.

## Parameters

### a

`unknown`

### b

`unknown`

## Returns

`boolean`
