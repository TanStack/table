---
id: table_autoResetExpanded
title: table_autoResetExpanded
---

# Function: table\_autoResetExpanded()

```ts
function table_autoResetExpanded<TFeatures, TData>(table): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L38)

Schedules an expanded-state reset after row-structure changes.

The reset runs when `autoResetAll`, `autoResetExpanded`, or the default
client-side expanding behavior allows it. Manual expanding opts out unless
the reset options explicitly opt back in.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_autoResetExpanded(table)
```
