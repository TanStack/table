---
id: getFunctionNameInfo
title: getFunctionNameInfo
---

```ts
function getFunctionNameInfo(staticFnName, splitBy?): object;
```

Defined in: [utils.ts:524](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L524)

Assumes that a function name is in the format of `parentName_fnKey` and returns the `fnKey` and `fnName` in the format of `parentName.fnKey`.

Splits on the first separator only, so an internal API name such as
`table__expandRows` has the `fnKey` `_expandRows`.

## Parameters

### staticFnName

`string`

### splitBy?

`"."` \| `"_"`

## Returns

`object`

### fnKey

```ts
fnKey: string;
```

### fnName

```ts
fnName: string;
```

### parentName

```ts
parentName: string;
```
