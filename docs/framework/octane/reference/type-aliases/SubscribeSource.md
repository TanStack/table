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

Defined in: [types.ts:92](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L92)

Any atom or store that `Subscribe` can read and subscribe to.

## Type Parameters

### TValue

`TValue`
