---
id: TableHelper_Core
title: TableHelper_Core
---

# Type Alias: TableHelper\_Core\<TFeatures, TData\>

```ts
type TableHelper_Core<TFeatures, TData>: object;
```

Internal type that each adapter package will build off of to create a table helper

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Type declaration

### columnHelper

```ts
columnHelper: ColumnHelper<TFeatures, TData>;
```

### features

```ts
features: TFeatures;
```

### options

```ts
options: Omit<TableOptions<TFeatures, TData>, "columns" | "data" | "state">;
```

### tableCreator()

```ts
tableCreator: (tableOptions) => Table<TFeatures, TData>;
```

#### Parameters

• **tableOptions**: `Omit`\<[`TableOptions`](tableoptions.md)\<`TFeatures`, `TData`\>, `"_features"` \| `"_rowModels"`\>

#### Returns

[`Table`](table.md)\<`TFeatures`, `TData`\>

## Defined in

[helpers/tableHelper.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L23)
