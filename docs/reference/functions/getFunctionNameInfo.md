---
id: getFunctionNameInfo
title: getFunctionNameInfo
---

# Function: getFunctionNameInfo()

```ts
function getFunctionNameInfo(staticFnName, splitBy): object;
```

Defined in: [utils.ts:299](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L299)

Assumes that a function name is in the format of `parentName_fnKey` and returns the `fnKey` and `fnName` in the format of `parentName.fnKey`.

## Parameters

### staticFnName

`string`

### splitBy

`"_"` | `"."`

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
