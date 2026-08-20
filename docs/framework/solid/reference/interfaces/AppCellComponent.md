---
id: AppCellComponent
title: AppCellComponent
---

# Interface: AppCellComponent()\<TFeatures, TData, TCellComponents\>

Defined in: [createTableHook.tsx:311](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L311)

Component type for AppCell - wraps a cell and provides cell context.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

```ts
AppCellComponent<TValue>(props): Element;
```

Defined in: [createTableHook.tsx:316](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L316)

Component type for AppCell - wraps a cell and provides cell context.

## Type Parameters

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### props

[`AppCellProps`](AppCellProps.md)\<`TFeatures`, `TData`, `TValue`, `TCellComponents`\>

## Returns

`Element`
