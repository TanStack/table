---
id: Prettify
title: Prettify
---

# Type Alias: Prettify\<T\>

```ts
type Prettify<T>: { [K in keyof T]: T[K] } & unknown;
```

## Type Parameters

• **T**

## Defined in

[types/type-utils.ts:86](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/type-utils.ts#L86)
