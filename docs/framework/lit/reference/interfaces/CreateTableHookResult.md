---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Interface: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

Defined in: [packages/lit-table/src/createTableHook.ts:359](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L359)

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

Defined in: [packages/lit-table/src/createTableHook.ts:366](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L366)

The features object that was passed to `createTableHook`.

***

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:371](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L371)

A column helper pre-bound to `TFeatures` and the registered components, so
the cell/header/footer render props expose the bound components.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](../type-aliases/AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

***

### useAppTable()

```ts
useAppTable: <TData, TSelected>(host, tableOptions, selector?) => object;
```

Defined in: [packages/lit-table/src/createTableHook.ts:382](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L382)

Creates a controller-like object whose `table()` method returns a table with
the `App*` wrapper functions, a bound `FlexRender`, and the registered
`tableComponents` attached. `TData` is inferred from the `data` option.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

##### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

#### Parameters

##### host

`ReactiveControllerHost` & `HTMLElement`

##### tableOptions

`Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

##### selector?

(`state`) => `TSelected`

#### Returns

`object`

##### table()

```ts
table: () => AppLitTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

###### Returns

[`AppLitTable`](../type-aliases/AppLitTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

***

### useCellContext()

```ts
useCellContext: <TValue>(host) => ContextConsumer<Context<symbol, Cell<TFeatures, any, TValue>>, ReactiveControllerHost & HTMLElement>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:411](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L411)

Reads the cell instance from a `@lit/context` `ContextConsumer`. lit never
provides an extended cell through context, so this is a BARE `Cell`.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Parameters

##### host

`ReactiveControllerHost` & `HTMLElement`

#### Returns

`ContextConsumer`\<`Context`\<`symbol`, `Cell`\<`TFeatures`, `any`, `TValue`\>\>, `ReactiveControllerHost` & `HTMLElement`\>

***

### useHeaderContext()

```ts
useHeaderContext: <TValue>(host) => ContextConsumer<Context<symbol, Header<TFeatures, any, TValue>>, ReactiveControllerHost & HTMLElement>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:421](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L421)

Reads the header instance from a `@lit/context` `ContextConsumer`. lit never
provides an extended header through context, so this is a BARE `Header`.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Parameters

##### host

`ReactiveControllerHost` & `HTMLElement`

#### Returns

`ContextConsumer`\<`Context`\<`symbol`, `Header`\<`TFeatures`, `any`, `TValue`\>\>, `ReactiveControllerHost` & `HTMLElement`\>

***

### useTableContext()

```ts
useTableContext: <TData>(host) => ContextConsumer<Context<symbol, LitTable<TFeatures, TData, any>>, ReactiveControllerHost & HTMLElement>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:401](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L401)

Reads the table provided by the nearest ancestor that called `useAppTable`,
via a `@lit/context` `ContextConsumer`. This is the BARE `LitTable` written
to the provider, not the extended `AppLitTable`.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Parameters

##### host

`ReactiveControllerHost` & `HTMLElement`

#### Returns

`ContextConsumer`\<`Context`\<`symbol`, [`LitTable`](../type-aliases/LitTable.md)\<`TFeatures`, `TData`, `any`\>\>, `ReactiveControllerHost` & `HTMLElement`\>
