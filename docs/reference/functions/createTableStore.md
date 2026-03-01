---
id: createTableStore
title: createTableStore
---

# Function: createTableStore()

```ts
function createTableStore<TFeatures>(features, initialState): Store<TableState<TFeatures>>;
```

Defined in: [core/table/constructTable.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/constructTable.ts#L22)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

## Parameters

### features

`TFeatures`

### initialState

`Partial`\<[`TableState`](../type-aliases/TableState.md)\<`TFeatures`\>\> | `undefined`

## Returns

`Store`\<[`TableState`](../type-aliases/TableState.md)\<`TFeatures`\>\>
