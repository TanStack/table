---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Type Alias: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents> = object;
```

Defined in: [helpers/createTableHook.ts:305](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L305)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, `RenderableComponent`\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `RenderableComponent`\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `RenderableComponent`\>

## Properties

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Defined in: [helpers/createTableHook.ts:311](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L311)

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

***

### injectAppTable()

```ts
injectAppTable: <TData, TSelected>(tableOptions, selector?) => AppAngularTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [helpers/createTableHook.ts:336](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L336)

#### Type Parameters

##### TData

`TData` *extends* `RowData`

##### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

#### Parameters

##### tableOptions

() => `Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"_features"` \| `"_rowModels"`\>

##### selector?

(`state`) => `TSelected`

#### Returns

[`AppAngularTable`](AppAngularTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

***

### injectFlexRenderCellContext()

```ts
injectFlexRenderCellContext: <TData, TValue>() => CellContext<TFeatures, TData, TValue>;
```

Defined in: [helpers/createTableHook.ts:332](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L332)

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

Defined in: [helpers/createTableHook.ts:328](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L328)

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
injectTableCellContext: <TValue, TRowData>() => Signal<Cell<TFeatures, TRowData, TValue>>;
```

Defined in: [helpers/createTableHook.ts:324](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L324)

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

##### TRowData

`TRowData` *extends* `RowData` = `RowData`

#### Returns

`Signal`\<`Cell`\<`TFeatures`, `TRowData`, `TValue`\>\>

***

### injectTableContext()

```ts
injectTableContext: <TData>() => Signal<AngularTable<TFeatures, TData>>;
```

Defined in: [helpers/createTableHook.ts:317](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L317)

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Returns

`Signal`\<[`AngularTable`](AngularTable.md)\<`TFeatures`, `TData`\>\>

***

### injectTableHeaderContext()

```ts
injectTableHeaderContext: <TValue, TRowData>() => Signal<Header<TFeatures, TRowData, TValue>>;
```

Defined in: [helpers/createTableHook.ts:320](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L320)

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

##### TRowData

`TRowData` *extends* `RowData` = `RowData`

#### Returns

`Signal`\<`Header`\<`TFeatures`, `TRowData`, `TValue`\>\>
