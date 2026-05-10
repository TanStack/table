---
id: tableFeatures
title: tableFeatures
---

# Function: tableFeatures()

```ts
function tableFeatures<TFeatures>(features): TFeatures;
```

Defined in: [helpers/tableFeatures.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableFeatures.ts#L14)

A helper function to help define the features that are to be imported and applied to a table instance.
Use this utility to make it easier to have the correct type inference for the features that are being imported.
**Note:** It is recommended to use this utility statically outside of a component.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

## Parameters

### features

`TFeatures`

## Returns

`TFeatures`

## Example

```
import { tableFeatures, columnVisibilityFeature, rowPinningFeature } from '@tanstack/react-table'
const _features = tableFeatures({ columnVisibilityFeature, rowPinningFeature });
const table = useTable({ _features, rowModels: {}, columns, data });
```
