---
id: AppColumnHelper
title: AppColumnHelper
---

# Type Alias: AppColumnHelper\<TFeatures, TData, TCellComponents, THeaderComponents\>

```ts
type AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents> = object;
```

Defined in: [createTableHook.tsx:162](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L162)

Enhanced column helper with pre-bound components in cell/header/footer contexts.
This enables TypeScript to know about the registered components when defining columns.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Properties

### accessor()

```ts
accessor: <TAccessor, TValue>(accessor, column) => TAccessor extends AccessorFn<TData> ? AccessorFnColumnDef<TFeatures, TData, TValue> : AccessorKeyColumnDef<TFeatures, TData, TValue>;
```

Defined in: [createTableHook.tsx:172](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L172)

Creates a data column definition with an accessor key or function.
The cell, header, and footer contexts include pre-bound components.

#### Type Parameters

##### TAccessor

`TAccessor` *extends* `AccessorFn`\<`TData`\> \| `DeepKeys`\<`TData`\>

##### TValue

`TValue` *extends* `TAccessor` *extends* `AccessorFn`\<`TData`, infer TReturn\> ? `TReturn` : `TAccessor` *extends* `DeepKeys`\<`TData`\> ? `DeepValue`\<`TData`, `TAccessor`\> : `never`

#### Parameters

##### accessor

`TAccessor`

##### column

`TAccessor` *extends* `AccessorFn`\<`TData`\> ? [`AppColumnDefBase`](AppColumnDefBase.md)\<`TFeatures`, `TData`, `TValue`, `TCellComponents`, `THeaderComponents`\> & `object` : [`AppColumnDefBase`](AppColumnDefBase.md)\<`TFeatures`, `TData`, `TValue`, `TCellComponents`, `THeaderComponents`\>

#### Returns

`TAccessor` *extends* `AccessorFn`\<`TData`\> ? `AccessorFnColumnDef`\<`TFeatures`, `TData`, `TValue`\> : `AccessorKeyColumnDef`\<`TFeatures`, `TData`, `TValue`\>

***

### columns()

```ts
columns: <TColumns>(columns) => ColumnDef<TFeatures, TData, any>[] & [...TColumns];
```

Defined in: [createTableHook.tsx:203](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L203)

Wraps an array of column definitions to preserve each column's individual TValue type.

#### Type Parameters

##### TColumns

`TColumns` *extends* `ReadonlyArray`\<`ColumnDef`\<`TFeatures`, `TData`, `any`\>\>

#### Parameters

##### columns

\[`...TColumns`\]

#### Returns

`ColumnDef`\<`TFeatures`, `TData`, `any`\>[] & \[`...TColumns`\]

***

### display()

```ts
display: (column) => DisplayColumnDef<TFeatures, TData, unknown>;
```

Defined in: [createTableHook.tsx:211](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L211)

Creates a display column definition for non-data columns.
The cell, header, and footer contexts include pre-bound components.

#### Parameters

##### column

[`AppDisplayColumnDef`](AppDisplayColumnDef.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

#### Returns

`DisplayColumnDef`\<`TFeatures`, `TData`, `unknown`\>

***

### group()

```ts
group: (column) => GroupColumnDef<TFeatures, TData, unknown>;
```

Defined in: [createTableHook.tsx:224](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L224)

Creates a group column definition with nested child columns.
The cell, header, and footer contexts include pre-bound components.

#### Parameters

##### column

[`AppGroupColumnDef`](AppGroupColumnDef.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

#### Returns

`GroupColumnDef`\<`TFeatures`, `TData`, `unknown`\>
