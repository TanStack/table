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

Defined in: [TableController.ts:19](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts#L19)

## Type Parameters

### TValue

`TValue`
