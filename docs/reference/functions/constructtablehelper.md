---
id: constructTableHelper
title: constructTableHelper
---

# Function: constructTableHelper()

```ts
function constructTableHelper<TFeatures, TData>(tableCreator, tableHelperOptions): TableHelper_Core<TFeatures, TData>
```

Internal function to create a table helper that each adapter package will use to create their own table helper

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **tableCreator**

• **tableHelperOptions**: [`TableHelperOptions`](../type-aliases/tablehelperoptions.md)\<`TFeatures`, `TData`\>

## Returns

[`TableHelper_Core`](../type-aliases/tablehelper_core.md)\<`TFeatures`, `TData`\>

## Defined in

[helpers/tableHelper.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L41)
