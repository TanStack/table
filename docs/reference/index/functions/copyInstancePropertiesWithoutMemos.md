---
id: copyInstancePropertiesWithoutMemos
title: copyInstancePropertiesWithoutMemos
---

# Function: copyInstancePropertiesWithoutMemos()

```ts
function copyInstancePropertiesWithoutMemos<TTarget, TSource>(target, source): TTarget & TSource;
```

Defined in: [utils.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L59)

Copies prototype-instance own properties without carrying over lazy memo
closures or the per-row cell cache, both of which are bound to the source
instance (cached cells reference the source row).

## Type Parameters

### TTarget

`TTarget` *extends* `Record`\<`string`, `any`\>

### TSource

`TSource` *extends* `Record`\<`string`, `any`\>

## Parameters

### target

`TTarget`

### source

`TSource`

## Returns

`TTarget` & `TSource`
