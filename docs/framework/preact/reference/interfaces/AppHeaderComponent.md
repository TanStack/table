---
id: AppHeaderComponent
title: AppHeaderComponent
---

# Interface: AppHeaderComponent()\<TFeatures, TData, THeaderComponents\>

Defined in: [createTableHook.tsx:494](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L494)

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
AppHeaderComponent<TValue>(props): ComponentChildren;
```

Defined in: [createTableHook.tsx:499](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L499)

Component type for AppHeader/AppFooter - wraps a header and provides header context with optional Subscribe

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

### Parameters

#### props

[`AppHeaderPropsWithoutSelector`](AppHeaderPropsWithoutSelector.md)\<`TFeatures`, `TData`, `TValue`, `THeaderComponents`\>

### Returns

`ComponentChildren`

## Call Signature

```ts
AppHeaderComponent<TValue, TSelected>(props): ComponentChildren;
```

Defined in: [createTableHook.tsx:507](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L507)

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

`ComponentChildren`
