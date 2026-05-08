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

Defined in: [Subscribe.ts:69](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L69)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TSelected

`TSelected` = `unknown`

### TSourceValue

`TSourceValue` = `unknown`
