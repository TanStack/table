---
id: SubscribePropsWithSource
title: SubscribePropsWithSource
---

# Type Alias: SubscribePropsWithSource\<TFeatures, TData, TSourceValue, TSelected\>

```ts
type SubscribePropsWithSource<TFeatures, TData, TSourceValue, TSelected> = 
  | SubscribePropsWithSourceIdentity<TFeatures, TData, TSourceValue>
| SubscribePropsWithSourceWithSelector<TFeatures, TData, TSourceValue, TSelected>;
```

Defined in: [Subscribe.ts:71](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L71)

Subscribe to a single source — atom or store (identity or projected). Prefer
[SubscribePropsWithSourceIdentity](SubscribePropsWithSourceIdentity.md) or [SubscribePropsWithSourceWithSelector](SubscribePropsWithSourceWithSelector.md)
for clearer inference when `selector` is omitted.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSourceValue

`TSourceValue`

### TSelected

`TSelected` = `TSourceValue`
