---
id: GetInitialState
title: GetInitialState
---

# Type Alias: GetInitialState()\<TConstructors\>

```ts
type GetInitialState<TConstructors> = (initialState) => TableState_All & Partial<TConstructors["TableState"]>;
```

Defined in: [types/TableFeatures.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L68)

## Type Parameters

### TConstructors

`TConstructors` *extends* `FeatureConstructors`

## Parameters

### initialState

`Partial`\<[`TableState_All`](TableState_All.md)\> & `Partial`\<`TConstructors`\[`"TableState"`\]\>

## Returns

[`TableState_All`](TableState_All.md) & `Partial`\<`TConstructors`\[`"TableState"`\]\>
