---
id: functionalUpdate
title: functionalUpdate
---

# Function: functionalUpdate()

```ts
function functionalUpdate<T>(updater, input): T;
```

Defined in: [utils.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L11)

Applies a TanStack updater to a value.

If the updater is a function it is called with the previous value; otherwise the updater value is returned directly.

## Type Parameters

### T

`T`

## Parameters

### updater

[`Updater`](../type-aliases/Updater.md)\<`T`\>

### input

`T`

## Returns

`T`
