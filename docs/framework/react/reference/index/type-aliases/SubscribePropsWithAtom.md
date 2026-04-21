---
id: SubscribePropsWithAtom
title: SubscribePropsWithAtom
---

# Type Alias: SubscribePropsWithAtom\<TFeatures, TData, TAtomValue, TSelected\>

```ts
type SubscribePropsWithAtom<TFeatures, TData, TAtomValue, TSelected> = 
  | SubscribePropsWithAtomIdentity<TFeatures, TData, TAtomValue>
| SubscribePropsWithAtomWithSelector<TFeatures, TData, TAtomValue, TSelected>;
```

Defined in: [Subscribe.ts:71](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L71)

Subscribe to a single slice atom (identity or projected). Prefer
[SubscribePropsWithAtomIdentity](SubscribePropsWithAtomIdentity.md) or [SubscribePropsWithAtomWithSelector](SubscribePropsWithAtomWithSelector.md)
for clearer inference when `selector` is omitted.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TAtomValue

`TAtomValue`

### TSelected

`TSelected` = `TAtomValue`
