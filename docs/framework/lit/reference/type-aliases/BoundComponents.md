---
id: BoundComponents
title: BoundComponents
---

# Type Alias: BoundComponents\<TComponents\>

```ts
type BoundComponents<TComponents> = { [TKey in keyof TComponents]: () => ReturnType<TComponents[TKey]> };
```

Defined in: [createTableHook.ts:34](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L34)

## Type Parameters

### TComponents

`TComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>
