---
id: DeepKeys
title: DeepKeys
---

# Type Alias: DeepKeys\<T, TDepth\>

```ts
type DeepKeys<T, TDepth>: TDepth["length"] extends 5 ? never : unknown extends T ? string : T extends ReadonlyArray<any> & IsTuple<T> ? AllowedIndexes<T> | DeepKeysPrefix<T, AllowedIndexes<T>, TDepth> : T extends any[] ? DeepKeys<T[number], [...TDepth, any]> : T extends Date ? never : T extends object ? keyof T & string | DeepKeysPrefix<T, keyof T, TDepth> : never;
```

## Type Parameters

• **T**

• **TDepth** *extends* `any`[] = []

## Defined in

[types/type-utils.ts:46](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/type-utils.ts#L46)
