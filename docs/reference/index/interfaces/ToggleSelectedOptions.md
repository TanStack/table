---
id: ToggleSelectedOptions
title: ToggleSelectedOptions
---

# Interface: ToggleSelectedOptions

Defined in: [features/row-selection/rowSelectionFeature.types.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L11)

Controls how toggling a row affects its descendants.

## Properties

### selectChildren?

```ts
optional selectChildren: boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L16)

Whether selectable child rows should be toggled recursively. Defaults to
`true`.
