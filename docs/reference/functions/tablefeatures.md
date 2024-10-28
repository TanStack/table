---
id: tableFeatures
title: tableFeatures
---

# Function: tableFeatures()

```ts
function tableFeatures<TFeatures>(features): TFeatures
```

A helper function to help define the features that are to be imported and applied to a table instance.

Use this utility to make it easier to have the correct type inference for the features that are being imported.

**Note:** It is recommended to use this utility statically outside of a component.

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

## Parameters

• **features**: `TFeatures`

## Returns

`TFeatures`

## Example

## Defined in

[helpers/tableFeatures.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableFeatures.ts#L18)
