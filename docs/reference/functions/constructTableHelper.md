---
id: constructTableHelper
title: constructTableHelper
---

# Function: constructTableHelper()

```ts
function constructTableHelper<TFeatures>(tableCreator, tableHelperOptions): TableHelper_Core<TFeatures>;
```

Defined in: [helpers/tableHelper.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L44)

Internal function to create a table helper that each adapter package will use to create their own table helper

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

## Parameters

### tableCreator

\<`TData`\>(`tableOptions`, `selector?`) => [`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

### tableHelperOptions

[`TableHelperOptions`](../type-aliases/TableHelperOptions.md)\<`TFeatures`\>

## Returns

[`TableHelper_Core`](../type-aliases/TableHelper_Core.md)\<`TFeatures`\>
