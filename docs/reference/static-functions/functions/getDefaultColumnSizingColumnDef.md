---
id: getDefaultColumnSizingColumnDef
title: getDefaultColumnSizingColumnDef
---

# Function: getDefaultColumnSizingColumnDef()

```ts
function getDefaultColumnSizingColumnDef(): object;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L41)

Returns the default column sizing column def.

Feature constructors use this value to initialize the table state or option defaults when no user value is provided.

## Returns

`object`

### maxSize

```ts
maxSize: number = Number.MAX_SAFE_INTEGER;
```

### minSize

```ts
minSize: number = 20;
```

### size

```ts
size: number = 150;
```

## Example

```ts
const initialValue = getDefaultColumnSizingColumnDef()
```
