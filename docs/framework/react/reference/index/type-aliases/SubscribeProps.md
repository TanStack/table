---
id: SubscribeProps
title: SubscribeProps
---

# Type Alias: SubscribeProps\<TFeatures, TData, TSelected, TSourceValue\>

```ts
type SubscribeProps<TFeatures, TData, TSelected, TSourceValue> = 
  | SubscribePropsWithStore<TFeatures, TData, TSelected>
  | SubscribePropsWithSourceIdentity<TFeatures, TData, TSourceValue>
| SubscribePropsWithSourceWithSelector<TFeatures, TData, TSourceValue, TSelected>;
```

Defined in: [Subscribe.ts:85](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L85)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `unknown`

### TSourceValue

`TSourceValue` = `unknown`
