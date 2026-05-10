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

Defined in: [packages/svelte-table/src/subscribe.ts:9](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/subscribe.ts#L9)

## Type Parameters

### TValue

`TValue`
