---
id: SubscribeProps
title: SubscribeProps
---

# Type Alias: SubscribeProps\<TFeatures, TData, TSelected, TAtomValue\>

```ts
type SubscribeProps<TFeatures, TData, TSelected, TAtomValue> = 
  | SubscribePropsWithStore<TFeatures, TData, TSelected>
  | SubscribePropsWithAtomIdentity<TFeatures, TData, TAtomValue>
| SubscribePropsWithAtomWithSelector<TFeatures, TData, TAtomValue, TSelected>;
```

Defined in: [Subscribe.ts:80](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L80)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `unknown`

### TAtomValue

`TAtomValue` = `unknown`
