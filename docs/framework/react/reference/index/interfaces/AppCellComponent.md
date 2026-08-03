---
id: AppCellComponent
title: AppCellComponent
---

# Interface: AppCellComponent()\<TFeatures, TData, TCellComponents\>

Defined in: [createTableHook.tsx:470](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L470)

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
AppCellComponent<TValue>(props): ReactNode;
```

Defined in: [createTableHook.tsx:475](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L475)

Component type for AppCell - wraps a cell and provides cell context with optional Subscribe

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

### Parameters

#### props

[`AppCellPropsWithoutSelector`](AppCellPropsWithoutSelector.md)\<`TFeatures`, `TData`, `TValue`, `TCellComponents`\>

### Returns

`ReactNode`

## Call Signature

```ts
AppCellComponent<TValue, TSelected>(props): ReactNode;
```

Defined in: [createTableHook.tsx:483](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L483)

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

`ReactNode`
