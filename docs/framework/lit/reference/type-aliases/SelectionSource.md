---
id: SelectionSource
title: SelectionSource
---

# Type Alias: SelectionSource\<TValue\>

```ts
type SelectionSource<TValue> = 
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
| ReadonlyStore<TValue>;
```

Defined in: [packages/lit-table/src/subscribe-directive.ts:13](https://github.com/fredericbahr/table/blob/main/packages/lit-table/src/subscribe-directive.ts#L13)

## Type Parameters

### TValue

`TValue`
