---
id: AppHeaderComponent
title: AppHeaderComponent
---

# Interface: AppHeaderComponent()\<TFeatures, TData, THeaderComponents\>

Defined in: [createTableHook.tsx:395](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L395)

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

Defined in: [createTableHook.tsx:400](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L400)

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

Defined in: [createTableHook.tsx:408](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L408)

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
