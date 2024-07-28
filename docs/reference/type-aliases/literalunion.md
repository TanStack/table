---
id: LiteralUnion
title: LiteralUnion
---

# Type Alias: LiteralUnion\<T, U\>

```ts
type LiteralUnion<T, U>: T | U & Record<never, never>;
```

## Type Parameters

• **T** *extends* `U`

• **U** = `string`

## Defined in

[types/type-utils.ts:82](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/type-utils.ts#L82)
