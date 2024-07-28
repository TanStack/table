---
id: NoInfer
title: NoInfer
---

# Type Alias: NoInfer\<T\>

```ts
type NoInfer<T>: [T][T extends any ? 0 : never];
```

## Type Parameters

• **T**

## Defined in

[types/type-utils.ts:78](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/type-utils.ts#L78)
