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

Defined in: [types.ts:159](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L159)

Subscribe to a single source — atom or store (identity or projected). Prefer
[SubscribePropsWithSourceIdentity](../interfaces/SubscribePropsWithSourceIdentity.md) or
[SubscribePropsWithSourceWithSelector](../interfaces/SubscribePropsWithSourceWithSelector.md) for clearer inference when
`selector` is omitted.

## Type Parameters

### TSourceValue

`TSourceValue`

### TSelected

`TSelected` = `TSourceValue`
