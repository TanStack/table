---
id: Column_ColumnGrouping
title: Column_ColumnGrouping
---

# Interface: Column\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L35)

## Properties

### getCanGroup()

```ts
getCanGroup: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L39)

Checks whether this column can currently be grouped.

#### Returns

`boolean`

***

### getGroupedIndex()

```ts
getGroupedIndex: () => number;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L43)

Finds this column's position in the ordered grouping state.

#### Returns

`number`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L47)

Checks whether this column id is present in grouping state.

#### Returns

`boolean`

***

### getToggleGroupingHandler()

```ts
getToggleGroupingHandler: () => () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L51)

Returns a function that toggles the grouping state of the column. This is useful for passing to the `onClick` prop of a button.

#### Returns

```ts
(): void;
```

##### Returns

`void`

***

### toggleGrouping()

```ts
toggleGrouping: () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L55)

Toggles the grouping state of the column.

#### Returns

`void`
