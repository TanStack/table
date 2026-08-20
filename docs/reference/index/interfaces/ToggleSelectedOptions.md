---
id: ToggleSelectedOptions
title: ToggleSelectedOptions
---

# Interface: ToggleSelectedOptions

Defined in: [features/row-selection/rowSelectionFeature.types.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L11)

Controls how toggling a row affects its descendants and ancestors.

## Properties

### deselectParents?

```ts
optional deselectParents: boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L27)

Whether ancestor row ids should be removed from the selection when this
row is deselected. Useful after a parent cascade wrote the parent id into
state and a child is later deselected. Defaults to `false`.

Ancestor ids are removed even when the ancestor itself cannot be selected.
Like the other targeted deselection paths, pruning is not gated by
`enableRowSelection`; only the bulk select-all paths preserve
non-selectable rows.

***

### selectChildren?

```ts
optional selectChildren: boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L16)

Whether selectable child rows should be toggled recursively. Defaults to
`true`.
