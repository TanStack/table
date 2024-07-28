---
id: _createTableHelper
title: _createTableHelper
---

# Function: \_createTableHelper()

```ts
function _createTableHelper<TFeatures, TData>(tableCreator, tableHelperOptions): TableHelper_Core<TFeatures, TData>
```

Internal function to create a table helper that each adapter package will use to create their own table helper

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **tableCreator**

• **tableHelperOptions**: [`TableHelperOptions`](../type-aliases/tablehelperoptions.md)\<`TFeatures`, `TData`\>

## Returns

[`TableHelper_Core`](../type-aliases/tablehelper_core.md)\<`TFeatures`, `TData`\>

## Defined in

[helpers/tableHelper.ts:41](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableHelper.ts#L41)
