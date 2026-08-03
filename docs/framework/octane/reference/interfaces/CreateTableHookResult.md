---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Interface: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

Defined in: [types.ts:811](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L811)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`TableComponentType`](../type-aliases/TableComponentType.md)\>

## Properties

### appFeatures

```ts
appFeatures: TFeatures;
```

Defined in: [types.ts:818](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L818)

The features object that was passed to `createTableHook`.

***

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Defined in: [types.ts:823](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L823)

A column helper pre-bound to `TFeatures` and the registered components, so
the cell/header/footer render props expose the bound components.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

***

### useAppTable()

```ts
useAppTable: <TData, TSelected>(tableOptions, selector?) => AppOctaneTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [types.ts:833](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L833)

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

[`AppOctaneTable`](../type-aliases/AppOctaneTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

***

### useCellContext()

```ts
useCellContext: <TValue>() => Cell_Core<TFeatures, any, TValue> & ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap> & TCellComponents & object;
```

Defined in: [types.ts:870](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L870)

Reads the cell provided by the nearest `<table.AppCell>`, extended with
your `cellComponents` and a context-bound `FlexRender`.

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

Defined in: [types.ts:881](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L881)

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
useTableContext: <TData, TSelected>() => AppOctaneTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [types.ts:855](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L855)

Reads the table provided by the nearest `<table.AppTable>`. This is the
same extended instance `useAppTable` returns, so the `App*` components and
your `tableComponents` are available on it.

Pass `TSelected` to match the selector you gave `useAppTable`, so
`table.state` is typed as the selected slice. It cannot be inferred
automatically (context does not carry the provider's generics), so it
defaults to the full table state, which is correct for the common case of
`useAppTable` without a selector.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

##### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

#### Returns

[`AppOctaneTable`](../type-aliases/AppOctaneTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>
