---
id: SubscribeStaticChild
title: SubscribeStaticChild
---

# Type Alias: SubscribeStaticChild

```ts
type SubscribeStaticChild =
  | ElementDescriptor<any>
  | string
  | number
  | boolean
  | null
  | undefined
| ReadonlyArray<unknown>;
```

Defined in: [types.ts:103](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L103)

A non-render-prop child accepted by Subscribe. This stays concrete instead
of using `OctaneNode` (currently `unknown`) so function children retain
contextual typing.
