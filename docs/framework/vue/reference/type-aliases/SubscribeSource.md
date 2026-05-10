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

Defined in: [packages/vue-table/src/useTable.ts:22](https://github.com/TanStack/table/blob/main/packages/vue-table/src/useTable.ts#L22)

## Type Parameters

### TValue

`TValue`
