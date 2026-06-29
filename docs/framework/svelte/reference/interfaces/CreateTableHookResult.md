---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Interface: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:379](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L379)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

## Properties

### appFeatures

```ts
appFeatures: TFeatures;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:386](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L386)

The features object that was passed to `createTableHook`.

***

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:391](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L391)

A column helper pre-bound to `TFeatures` and the registered components, so
the cell/header/footer render props expose the bound components.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](../type-aliases/AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

***

### createAppTable()

```ts
createAppTable: <TData, TSelected>(tableOptions, selector?) => AppSvelteTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:401](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L401)

Creates a table with the `App*` wrapper components and registered
`tableComponents` attached. `TData` is inferred from the `data` option.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

##### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

#### Parameters

##### tableOptions

`Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

##### selector?

(`state`) => `TSelected`

#### Returns

[`AppSvelteTable`](../type-aliases/AppSvelteTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell_Core<TFeatures, any, TValue> & ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap> & TCellComponents & object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:438](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L438)

Reads the cell provided by the nearest `<table.AppCell>`, extended with your
`cellComponents` and a context-bound `FlexRender`.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Cell_Core`\<`TFeatures`, `any`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Cell_FeatureMap`\> & `TCellComponents` & `object`

***

### useHeaderContext()

```ts
useHeaderContext: <TValue>() => Header_Core<TFeatures, any, TValue> & ExtractFeatureMapTypes<TFeatures, Header_FeatureMap> & THeaderComponents & object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:449](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L449)

Reads the header provided by the nearest `<table.AppHeader>` /
`<table.AppFooter>`, extended with your `headerComponents` and a
context-bound `FlexRender`.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Header_Core`\<`TFeatures`, `any`, `TValue`\> & `ExtractFeatureMapTypes`\<`TFeatures`, `Header_FeatureMap`\> & `THeaderComponents` & `object`

***

### useTableContext()

```ts
useTableContext: <TData, TSelected>() => AppSvelteTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:423](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L423)

Reads the table provided by the nearest `<table.AppTable>`. This is the same
extended instance `createAppTable` returns, so the `App*` components and your
`tableComponents` are available on it.

Pass `TSelected` to match the selector you gave `createAppTable`, so
`table.state` is typed as the selected slice. It cannot be inferred
automatically (context does not carry the provider's generics), so it
defaults to the full table state, which is correct for the common case of
`createAppTable` without a selector.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

##### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

#### Returns

[`AppSvelteTable`](../type-aliases/AppSvelteTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>
