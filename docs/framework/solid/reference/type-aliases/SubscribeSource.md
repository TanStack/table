---
id: SubscribeSource
title: SubscribeSource
---

# Type Alias: SubscribeSource\<TValue\>

```ts
type SubscribeSource<TValue> = 
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
| ReadonlyStore<TValue>;
```

Defined in: [createTable.ts:21](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTable.ts#L21)

## Type Parameters

### TValue

`TValue`
