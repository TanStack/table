---
id: makeObjectMap
title: makeObjectMap
---

# Function: makeObjectMap()

```ts
function makeObjectMap<TValue>(): Record<string, TValue>;
```

Defined in: [utils.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L59)

Creates an object intended only for string-keyed dictionary lookups.

The null prototype keeps user-controlled ids such as `__proto__` and
`hasOwnProperty` as plain data keys.

## Type Parameters

### TValue

`TValue` = `unknown`

## Returns

`Record`\<`string`, `TValue`\>
