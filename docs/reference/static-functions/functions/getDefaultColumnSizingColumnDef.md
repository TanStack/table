---
id: getDefaultColumnSizingColumnDef
title: getDefaultColumnSizingColumnDef
---

# Function: getDefaultColumnSizingColumnDef()

```ts
function getDefaultColumnSizingColumnDef(): object;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L44)

Creates the built-in sizing defaults for column definitions.

Columns default to `size: 150`, `minSize: 20`, and
`maxSize: Number.MAX_SAFE_INTEGER` unless overridden by column definitions or
table defaults.

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
const defaults = getDefaultColumnSizingColumnDef()
```
