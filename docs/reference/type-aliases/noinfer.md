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

[types/type-utils.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L78)
