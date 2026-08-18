---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Interface: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:377](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L377)

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

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:384](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L384)

The features object that was passed to `createTableHook`.

***

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:389](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L389)

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
createAppTable: <TData>(tableOptions) => AppSvelteTable<TFeatures, TData, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:403](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L403)

Creates a table with the `App*` wrapper components and registered
`tableComponents` attached. `TData` is inferred from the `data` option.

Read table state with `table.atoms.<slice>.get()` or `table.store.get()`.
These reads participate in Svelte dependency tracking inside templates,
`$derived`, and `$effect`.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Parameters

##### tableOptions

`Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

#### Returns

[`AppSvelteTable`](../type-aliases/AppSvelteTable.md)\<`TFeatures`, `TData`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell_Core<TFeatures, any, TValue> & ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap> & TCellComponents & object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:428](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L428)

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

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:439](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L439)

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
useTableContext: <TData>() => AppSvelteTable<TFeatures, TData, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:417](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L417)

Reads the table provided by the nearest `<table.AppTable>`. This is the same
extended instance `createAppTable` returns, so the `App*` components and your
`tableComponents` are available on it.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Returns

[`AppSvelteTable`](../type-aliases/AppSvelteTable.md)\<`TFeatures`, `TData`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>
