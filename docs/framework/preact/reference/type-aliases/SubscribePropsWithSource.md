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

Defined in: [Subscribe.ts:57](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L57)

Subscribe to a single source — atom or store (identity or projected).

## Type Parameters

### TSourceValue

`TSourceValue`

### TSelected

`TSelected` = `TSourceValue`
