---
id: AppHeaderComponent
title: AppHeaderComponent
---

# Interface: AppHeaderComponent()\<TFeatures, TData, THeaderComponents\>

Defined in: [createTableHook.tsx:495](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L495)

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

Defined in: [createTableHook.tsx:500](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L500)

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

Defined in: [createTableHook.tsx:508](https://github.com/TanStack/table/blob/main/packages/preact-table/src/createTableHook.tsx#L508)

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
