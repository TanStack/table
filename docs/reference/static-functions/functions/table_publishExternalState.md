---
id: table_publishExternalState
title: table_publishExternalState
---

# Function: table\_publishExternalState()

```ts
function table_publishExternalState<TFeatures, TData>(
   table,
   state,
   compare): void;
```

Defined in: [core/table/coreTablesFeature.utils.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L73)

Publishes captured controlled state after a host framework commits.

Render-phase adapters stage options without synchronizing base atoms, then
pass the state captured by the committed render here. The commit signal also
invalidates ownership changes when no base atom was written.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### state

`Partial`\<[`TableState`](../../index/type-aliases/TableState.md)\<`TFeatures`\>\> | `null`

### compare

(`currentState`, `externalState`) => `boolean`

## Returns

`void`
