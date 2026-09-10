---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Type Alias: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents> = object;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:302](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L302)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`RenderableComponent`](RenderableComponent.md)\>

## Properties

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:308](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L308)

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

***

### injectAppTable()

```ts
injectAppTable: <TData>(tableOptions) => AppAngularTable<TFeatures, TData, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:333](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L333)

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Parameters

##### tableOptions

() => `Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

#### Returns

[`AppAngularTable`](AppAngularTable.md)\<`TFeatures`, `TData`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

***

### injectFlexRenderCellContext()

```ts
injectFlexRenderCellContext: <TData, TValue>() => CellContext<TFeatures, TData, TValue>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:329](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L329)

#### Type Parameters

##### TData

`TData` *extends* `RowData`

##### TValue

`TValue` *extends* `CellData`

#### Returns

`CellContext`\<`TFeatures`, `TData`, `TValue`\>

***

### injectFlexRenderHeaderContext()

```ts
injectFlexRenderHeaderContext: <TData, TValue>() => HeaderContext<TFeatures, TData, TValue>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:325](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L325)

#### Type Parameters

##### TData

`TData` *extends* `RowData`

##### TValue

`TValue` *extends* `CellData`

#### Returns

`HeaderContext`\<`TFeatures`, `TData`, `TValue`\>

***

### injectTableCellContext()

```ts
injectTableCellContext: <TValue, TRowData>() => Signal<Cell<TFeatures, TRowData, TValue> & TCellComponents>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:321](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L321)

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

##### TRowData

`TRowData` *extends* `RowData` = `RowData`

#### Returns

`Signal`\<`Cell`\<`TFeatures`, `TRowData`, `TValue`\> & `TCellComponents`\>

***

### injectTableContext()

```ts
injectTableContext: <TData>() => Signal<AngularTable<TFeatures, TData> & TTableComponents>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:314](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L314)

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Returns

`Signal`\<[`AngularTable`](AngularTable.md)\<`TFeatures`, `TData`\> & `TTableComponents`\>

***

### injectTableHeaderContext()

```ts
injectTableHeaderContext: <TValue, TRowData>() => Signal<Header<TFeatures, TRowData, TValue> & THeaderComponents>;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:317](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L317)

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

##### TRowData

`TRowData` *extends* `RowData` = `RowData`

#### Returns

`Signal`\<`Header`\<`TFeatures`, `TRowData`, `TValue`\> & `THeaderComponents`\>
