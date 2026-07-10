---
id: AppHeaderComponent
title: AppHeaderComponent
---

# Interface: AppHeaderComponent()\<TFeatures, TData, THeaderComponents\>

Defined in: [createTableHook.tsx:325](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L325)

Component type for AppHeader/AppFooter - wraps a header and provides header context.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

```ts
AppHeaderComponent<TValue>(props): Element;
```

Defined in: [createTableHook.tsx:330](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L330)

Component type for AppHeader/AppFooter - wraps a header and provides header context.

## Type Parameters

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### props

[`AppHeaderProps`](AppHeaderProps.md)\<`TFeatures`, `TData`, `TValue`, `THeaderComponents`\>

## Returns

`Element`
