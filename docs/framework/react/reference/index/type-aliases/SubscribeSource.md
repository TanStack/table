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

Defined in: [Subscribe.ts:13](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L13)

## Type Parameters

### TValue

`TValue`
