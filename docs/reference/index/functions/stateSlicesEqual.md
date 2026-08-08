---
id: stateSlicesEqual
title: stateSlicesEqual
---

# Function: stateSlicesEqual()

```ts
function stateSlicesEqual(
   a,
   b,
   depth): boolean;
```

Defined in: [utils.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L146)

Structurally compares two state slice values.

Arrays and plain objects are walked recursively up to
`MAX_STATE_COMPARE_DEPTH` levels; dates compare by timestamp; everything
else (including class instances, mirroring the `cloneState` plain-object
policy) compares by `Object.is`. A `false` result is always safe: it just
means the state update goes through.

## Parameters

### a

`unknown`

### b

`unknown`

### depth

`number` = `MAX_STATE_COMPARE_DEPTH`

## Returns

`boolean`
