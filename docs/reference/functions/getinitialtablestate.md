---
id: getInitialTableState
title: getInitialTableState
---

# Function: getInitialTableState()

```ts
function getInitialTableState<TFeatures>(features, initialState): TableState<TFeatures>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

## Parameters

• **features**: `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **initialState**: `undefined` \| `Partial`\<[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>\> = `{}`

## Returns

[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>

## Defined in

[core/table/constructTable.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/constructTable.ts#L10)
