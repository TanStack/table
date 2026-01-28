---
id: GetDefaultStateSelector
title: GetDefaultStateSelector
---

# Type Alias: GetDefaultStateSelector()\<TConstructors\>

```ts
type GetDefaultStateSelector<TConstructors> = (state) => Partial<TableState_All> & Partial<TConstructors["TableState"]>;
```

Defined in: [packages/table-core/src/types/TableFeatures.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L72)

## Type Parameters

### TConstructors

`TConstructors` *extends* `FeatureConstructors`

## Parameters

### state

[`TableState_All`](TableState_All.md)

## Returns

`Partial`\<[`TableState_All`](TableState_All.md)\> & `Partial`\<`TConstructors`\[`"TableState"`\]\>
