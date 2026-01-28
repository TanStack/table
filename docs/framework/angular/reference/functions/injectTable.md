---
id: injectTable
title: injectTable
---

# Function: injectTable()

```ts
function injectTable<TFeatures, TData, TSelected>(options, selector): AngularTable<TFeatures, TData, TSelected>;
```

Defined in: [injectTable.ts:40](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L40)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

## Parameters

### options

() => `TableOptions`\<`TFeatures`, `TData`\>

### selector

(`state`) => `TSelected`

## Returns

[`AngularTable`](../type-aliases/AngularTable.md)\<`TFeatures`, `TData`, `TSelected`\>
