---
id: TableHelper
title: TableHelper
---

# Type Alias: TableHelper\<TFeatures, TData\>

```ts
type TableHelper<TFeatures, TData>: Omit<TableHelper_Core<TFeatures, TData>, "tableCreator"> & object;
```

## Type declaration

### useTable()

```ts
useTable: (tableOptions) => Table<TFeatures, TData>;
```

#### Parameters

• **tableOptions**: `Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"_features"` \| `"_rowModels"`\>

#### Returns

`Table`\<`TFeatures`, `TData`\>

## Type Parameters

• **TFeatures** *extends* `TableFeatures`

• **TData** *extends* `RowData`

## Defined in

[react-table/src/tableHelper.ts:12](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/react-table/src/tableHelper.ts#L12)
