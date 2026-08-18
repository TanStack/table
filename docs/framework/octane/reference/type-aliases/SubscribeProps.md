---
id: SubscribeProps
title: SubscribeProps
---

# Type Alias: SubscribeProps\<TFeatures, TSelected, TSourceValue\>

```ts
type SubscribeProps<TFeatures, TSelected, TSourceValue> =
  | SubscribePropsWithStore<TFeatures, TSelected>
  | SubscribePropsWithSourceIdentity<TSourceValue>
| SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>;
```

Defined in: [types.ts:160](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L160)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TSelected

`TSelected` = `unknown`

### TSourceValue

`TSourceValue` = `unknown`
