---
id: Cell_CellSelection
title: Cell_CellSelection
---

# Interface: Cell\_CellSelection

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:159](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L159)

## Properties

### getCanSelect()

```ts
getCanSelect: () => boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L163)

Checks whether this cell can currently be selected.

#### Returns

`boolean`

***

### getIsFocused()

```ts
getIsFocused: () => boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L168)

Checks whether this cell is the active cell, i.e. the anchor of the most
recent range.

#### Returns

`boolean`

***

### getIsSelected()

```ts
getIsSelected: () => boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:172](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L172)

Checks whether this cell falls inside the final positive selection.

#### Returns

`boolean`

***

### getSelectionEdges()

```ts
getSelectionEdges: () => CellSelectionEdges;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L180)

Returns which sides of this cell sit on the outer boundary of the
selection, for rendering a spreadsheet-style outline without each cell
inspecting its neighbours.

All sides are `false` when the cell is not selected.

#### Returns

[`CellSelectionEdges`](CellSelectionEdges.md)

***

### getSelectionExtendHandler()

```ts
getSelectionExtendHandler: () => (event) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:188](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L188)

Creates a handler that extends the active range to this cell while a drag
is in progress. Bind it to `mouseenter`.

The handler no-ops unless a drag is open, and skips redundant writes when
the active range already focuses this cell.

#### Returns

```ts
(event): void;
```

##### Parameters

###### event

`unknown`

##### Returns

`void`

***

### getSelectionStartHandler()

```ts
getSelectionStartHandler: (contextDocument?) => (event) => void;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:199](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L199)

Creates a handler that begins a selection at this cell. Bind it to
`mousedown`.

Pass the original mouse event, or a framework event whose `nativeEvent` is
that event, so modifier keys can be detected. The handler attaches its own
document-level `mouseup` listener so a drag released outside the table
still ends correctly; pass `contextDocument` when the table renders into
another document, such as an iframe or popout window.

#### Parameters

##### contextDocument?

`Document`

#### Returns

```ts
(event): void;
```

##### Parameters

###### event

`unknown`

##### Returns

`void`

***

### getTabIndex()

```ts
getTabIndex: () => number;
```

Defined in: [features/cell-selection/cellSelectionFeature.types.ts:205](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts#L205)

Returns `0` for the focused cell and `-1` otherwise, for roving tabindex.

#### Returns

`number`
