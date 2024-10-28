---
id: getFunctionNameInfo
title: getFunctionNameInfo
---

# Function: getFunctionNameInfo()

```ts
function getFunctionNameInfo(fn): object
```

Assumes that a function name is in the format of `parentName_fnKey` and returns the `fnKey` and `fnName` in the format of `parentName.fnKey`.

## Parameters

• **fn**: `AnyFunction`

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

## Defined in

[utils.ts:183](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L183)
