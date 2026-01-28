---
id: TableHelper_Core
title: TableHelper_Core
---

# Type Alias: TableHelper\_Core\<TFeatures\>

```ts
type TableHelper_Core<TFeatures> = object;
```

Defined in: [packages/table-core/src/helpers/tableHelper.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L22)

Internal type that each adapter package will build off of to create a table helper

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

## Properties

### createColumnHelper()

```ts
createColumnHelper: <TData>() => ColumnHelper<TFeatures, TData>;
```

Defined in: [packages/table-core/src/helpers/tableHelper.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L23)

#### Type Parameters

##### TData

`TData` *extends* [`RowData`](RowData.md)

#### Returns

[`ColumnHelper`](ColumnHelper.md)\<`TFeatures`, `TData`\>

***

### features

```ts
features: TFeatures;
```

Defined in: [packages/table-core/src/helpers/tableHelper.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L27)

***

### options

```ts
options: Omit<TableOptions<TFeatures, any>, "columns" | "data" | "store" | "state" | "initialState">;
```

Defined in: [packages/table-core/src/helpers/tableHelper.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L28)

***

### tableCreator()

```ts
tableCreator: <TData>(tableOptions, selector?) => Table<TFeatures, TData>;
```

Defined in: [packages/table-core/src/helpers/tableHelper.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L32)

#### Type Parameters

##### TData

`TData` *extends* [`RowData`](RowData.md)

#### Parameters

##### tableOptions

`Omit`\<[`TableOptions`](TableOptions.md)\<`TFeatures`, `TData`\>, `"_features"` \| `"_rowModels"`\>

##### selector?

`any`

#### Returns

[`Table`](Table.md)\<`TFeatures`, `TData`\>
