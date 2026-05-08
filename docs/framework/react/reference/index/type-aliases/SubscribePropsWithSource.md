---
id: SubscribePropsWithSource
title: SubscribePropsWithSource
---

# Type Alias: SubscribePropsWithSource\<TSourceValue, TSelected\>

```ts
type SubscribePropsWithSource<TSourceValue, TSelected> = 
  | SubscribePropsWithSourceIdentity<TSourceValue>
| SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>;
```

Defined in: [Subscribe.ts:65](https://github.com/TanStack/table/blob/main/packages/react-table/src/Subscribe.ts#L65)

Subscribe to a single source — atom or store (identity or projected). Prefer
[SubscribePropsWithSourceIdentity](SubscribePropsWithSourceIdentity.md) or [SubscribePropsWithSourceWithSelector](SubscribePropsWithSourceWithSelector.md)
for clearer inference when `selector` is omitted.

## Type Parameters

### TSourceValue

`TSourceValue`

### TSelected

`TSelected` = `TSourceValue`
