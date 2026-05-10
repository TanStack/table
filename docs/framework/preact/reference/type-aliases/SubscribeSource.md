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

Defined in: [Subscribe.ts:11](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L11)

## Type Parameters

### TValue

`TValue`
