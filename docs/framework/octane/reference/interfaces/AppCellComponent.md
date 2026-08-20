---
id: AppCellComponent
title: AppCellComponent
---

# Interface: AppCellComponent()\<TFeatures, TData, TCellComponents\>

Defined in: [types.ts:670](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L670)

Component type for AppCell — wraps a cell and provides cell context with
optional Subscribe.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

## Call Signature

```ts
AppCellComponent<TValue>(props): unknown;
```

Defined in: [types.ts:675](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L675)

Component type for AppCell — wraps a cell and provides cell context with
optional Subscribe.

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

### Parameters

#### props

[`AppCellPropsWithoutSelector`](AppCellPropsWithoutSelector.md)\<`TFeatures`, `TData`, `TValue`, `TCellComponents`\>

### Returns

`unknown`

## Call Signature

```ts
AppCellComponent<TValue, TSelected>(props): unknown;
```

Defined in: [types.ts:683](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L683)

Component type for AppCell — wraps a cell and provides cell context with
optional Subscribe.

### Type Parameters

#### TValue

`TValue` *extends* `unknown` = `unknown`

#### TSelected

`TSelected` = `unknown`

### Parameters

#### props

[`AppCellPropsWithSelector`](AppCellPropsWithSelector.md)\<`TFeatures`, `TData`, `TValue`, `TCellComponents`, `TSelected`\>

### Returns

`unknown`
