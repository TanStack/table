---
id: AppHeaderComponent
title: AppHeaderComponent
---

# Interface: AppHeaderComponent()\<TFeatures, TData, THeaderComponents\>

Defined in: [types.ts:698](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L698)

Component type for AppHeader/AppFooter — wraps a header and provides header
context with optional Subscribe.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

## Call Signature

```ts
AppHeaderComponent<TValue>(props): unknown;
```

Defined in: [types.ts:703](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L703)

Component type for AppHeader/AppFooter — wraps a header and provides header
context with optional Subscribe.

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

### Parameters

#### props

[`AppHeaderPropsWithoutSelector`](AppHeaderPropsWithoutSelector.md)\<`TFeatures`, `TData`, `TValue`, `THeaderComponents`\>

### Returns

`unknown`

## Call Signature

```ts
AppHeaderComponent<TValue, TSelected>(props): unknown;
```

Defined in: [types.ts:711](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L711)

Component type for AppHeader/AppFooter — wraps a header and provides header
context with optional Subscribe.

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

#### TSelected

`TSelected` = `unknown`

### Parameters

#### props

[`AppHeaderPropsWithSelector`](AppHeaderPropsWithSelector.md)\<`TFeatures`, `TData`, `TValue`, `THeaderComponents`, `TSelected`\>

### Returns

`unknown`
