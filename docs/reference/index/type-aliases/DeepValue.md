---
id: DeepValue
title: DeepValue
---

# Type Alias: DeepValue\<T, TProp\>

```ts
type DeepValue<T, TProp> = T extends Record<string | number, any> ? TProp extends `${infer TBranch}.${infer TDeepProp}` ? DeepValue<T[TBranch], TDeepProp> : T[TProp & string] : never;
```

Defined in: [types/type-utils.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L71)

## Type Parameters

### T

`T`

### TProp

`TProp`
