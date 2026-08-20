---
id: BoundComponents
title: BoundComponents
---

# Type Alias: BoundComponents\<TComponents\>

```ts
type BoundComponents<TComponents> = { [TKey in keyof TComponents]: () => ReturnType<TComponents[TKey]> };
```

Defined in: [packages/lit-table/src/createTableHook.ts:35](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L35)

## Type Parameters

### TComponents

`TComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>
