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

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

## Parameters

• **features**: `TFeatures`

## Returns

`TFeatures`

## Example

## Defined in

[helpers/tableFeatures.ts:17](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableFeatures.ts#L17)
