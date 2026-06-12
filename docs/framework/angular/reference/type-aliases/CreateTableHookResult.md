---
id: CreateTableHookResult
title: CreateTableHookResult
---

# Type Alias: CreateTableHookResult\<TFeatures, TTableComponents, TCellComponents, THeaderComponents\>

```ts
type CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents> = object;
```

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:304](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L304)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:310](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L310)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:335](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L335)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:331](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L331)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:327](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L327)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:323](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L323)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:316](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L316)

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

Defined in: [packages/angular-table/src/helpers/createTableHook.ts:319](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/createTableHook.ts#L319)

#### Type Parameters

##### TValue

`TValue` *extends* `CellData` = `CellData`

##### TRowData

`TRowData` *extends* `RowData` = `RowData`

#### Returns

`Signal`\<`Header`\<`TFeatures`, `TRowData`, `TValue`\>\>
