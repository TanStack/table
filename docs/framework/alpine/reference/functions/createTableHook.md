---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures>(__namedParameters): object;
```

Defined in: [createTableHook.ts:26](https://github.com/TanStack/table/blob/main/packages/alpine-table/src/createTableHook.ts#L26)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

## Parameters

### \_\_namedParameters

[`CreateTableHookOptions`](../type-aliases/CreateTableHookOptions.md)\<`TFeatures`\>

## Returns

`object`

### appFeatures

```ts
appFeatures: TFeatures;
```

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => ColumnHelper<TFeatures, TData>;
```

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

`ColumnHelper`\<`TFeatures`, `TData`\>

### createAppTable()

```ts
createAppTable: <TData>(tableOptions, selector?) => AppAlpineTable<TFeatures, TData>;
```

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Parameters

##### tableOptions

`Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

##### selector?

(`state`) => `unknown`

#### Returns

[`AppAlpineTable`](../type-aliases/AppAlpineTable.md)\<`TFeatures`, `TData`\>
