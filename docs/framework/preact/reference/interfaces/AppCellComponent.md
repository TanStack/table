---
id: AppCellComponent
title: AppCellComponent
---

# Interface: AppCellComponent()\<TFeatures, TData, TCellComponents\>

Defined in: [createTableHook.tsx:467](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L467)

Component type for AppCell - wraps a cell and provides cell context with optional Subscribe

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Call Signature

```ts
AppCellComponent<TValue>(props): ComponentChildren;
```

Defined in: [createTableHook.tsx:472](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L472)

Component type for AppCell - wraps a cell and provides cell context with optional Subscribe

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

### Parameters

#### props

[`AppCellPropsWithoutSelector`](AppCellPropsWithoutSelector.md)\<`TFeatures`, `TData`, `TValue`, `TCellComponents`\>

### Returns

`ComponentChildren`

## Call Signature

```ts
AppCellComponent<TValue, TSelected>(props): ComponentChildren;
```

Defined in: [createTableHook.tsx:480](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L480)

Component type for AppCell - wraps a cell and provides cell context with optional Subscribe

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

#### TSelected

`TSelected` = `unknown`

### Parameters

#### props

[`AppCellPropsWithSelector`](AppCellPropsWithSelector.md)\<`TFeatures`, `TData`, `TValue`, `TCellComponents`, `TSelected`\>

### Returns

`ComponentChildren`
