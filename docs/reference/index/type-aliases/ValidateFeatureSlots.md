---
id: ValidateFeatureSlots
title: ValidateFeatureSlots
---

# Type Alias: ValidateFeatureSlots\<TFeatures\>

```ts
type ValidateFeatureSlots<TFeatures> = IsAny<TFeatures> extends true ? object : { [K in keyof TFeatures as K extends keyof FeatureSlotPrereqs ? K : never]: K extends keyof FeatureSlotPrereqs ? [Extract<FeatureSlotPrereqs[K], keyof TFeatures>] extends [never] ? `Error: '${K & string}' requires '${FeatureSlotPrereqs[K] & string}' to be included in this table's features.` : TFeatures[K] : never };
```

Defined in: [types/TableFeatures.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L86)

Validates that every row model and fn registry slot in a features object is
accompanied by its prerequisite feature.

Slots whose prerequisite is missing have their type replaced with a literal
error message, so the offending property fails to type-check with a message
naming the feature that needs to be added.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
