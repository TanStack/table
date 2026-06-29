---
id: AppHeaderComponent
title: AppHeaderComponent
---

# Interface: AppHeaderComponent()\<TFeatures, TData, THeaderComponents\>

Defined in: [createTableHook.tsx:498](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L498)

Component type for AppHeader/AppFooter - wraps a header and provides header context with optional Subscribe

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Call Signature

```ts
AppHeaderComponent<TValue>(props): ReactNode;
```

Defined in: [createTableHook.tsx:503](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L503)

Component type for AppHeader/AppFooter - wraps a header and provides header context with optional Subscribe

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

### Parameters

#### props

[`AppHeaderPropsWithoutSelector`](AppHeaderPropsWithoutSelector.md)\<`TFeatures`, `TData`, `TValue`, `THeaderComponents`\>

### Returns

`ReactNode`

## Call Signature

```ts
AppHeaderComponent<TValue, TSelected>(props): ReactNode;
```

Defined in: [createTableHook.tsx:511](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L511)

Component type for AppHeader/AppFooter - wraps a header and provides header context with optional Subscribe

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

#### TSelected

`TSelected` = `unknown`

### Parameters

#### props

[`AppHeaderPropsWithSelector`](AppHeaderPropsWithSelector.md)\<`TFeatures`, `TData`, `TValue`, `THeaderComponents`, `TSelected`\>

### Returns

`ReactNode`
