---
id: memo
title: memo
---

# Function: memo()

```ts
function memo<TDeps, TDepArgs, TResult>(
   memoDeps, 
   fn, 
   opts): (depArgs?) => TResult
```

## Type Parameters

• **TDeps** *extends* readonly `any`[]

• **TDepArgs**

• **TResult**

## Parameters

• **memoDeps**

• **fn**

• **opts**

• **opts.debug?**

• **opts.key**: `any`

• **opts.onChange?**

## Returns

`Function`

### Parameters

• **depArgs?**: `TDepArgs`

### Returns

`TResult`

## Defined in

[utils.ts:59](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/utils.ts#L59)
