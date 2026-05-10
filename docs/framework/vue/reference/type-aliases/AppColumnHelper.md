---
id: AppColumnHelper
title: AppColumnHelper
---

# Type Alias: AppColumnHelper\<TFeatures, TData, TCellComponents, THeaderComponents\>

```ts
type AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents> = object;
```

Defined in: [packages/vue-table/src/createTableHook.ts:127](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L127)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](ComponentType.md)\<`any`\>\>

## Properties

### accessor()

```ts
accessor: <TAccessor, TValue>(accessor, column) => TAccessor extends AccessorFn<TData> ? AccessorFnColumnDef<TFeatures, TData, TValue> : AccessorKeyColumnDef<TFeatures, TData, TValue>;
```

Defined in: [packages/vue-table/src/createTableHook.ts:133](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L133)

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

Defined in: [packages/vue-table/src/createTableHook.ts:160](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L160)

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

Defined in: [packages/vue-table/src/createTableHook.ts:163](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L163)

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

Defined in: [packages/vue-table/src/createTableHook.ts:171](https://github.com/TanStack/table/blob/main/packages/vue-table/src/createTableHook.ts#L171)

#### Parameters

##### column

[`AppGroupColumnDef`](AppGroupColumnDef.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

#### Returns

`GroupColumnDef`\<`TFeatures`, `TData`, `unknown`\>
