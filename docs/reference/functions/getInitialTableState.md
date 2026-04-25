---
id: getInitialTableState
title: getInitialTableState
---

# Function: getInitialTableState()

```ts
function getInitialTableState<TFeatures>(features, initialState): TableState<TFeatures>;
```

Defined in: [core/table/constructTable.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/constructTable.ts#L10)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

## Parameters

### features

`TFeatures`

### initialState

`Partial`\<[`TableState`](../type-aliases/TableState.md)\<`TFeatures`\>\> | `undefined`

## Returns

[`TableState`](../type-aliases/TableState.md)\<`TFeatures`\>
