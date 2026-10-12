---
id: Column_ColumnGrouping
title: Column_ColumnGrouping
---

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L36)

## Properties

### getCanGroup

```ts
getCanGroup: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L40)

Checks whether this column can currently be grouped.

#### Returns

`boolean`

***

### getGroupedIndex

```ts
getGroupedIndex: () => number;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L44)

Finds this column's position in the ordered grouping state.

#### Returns

`number`

***

### getIsGrouped

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L48)

Checks whether this column id is present in grouping state.

#### Returns

`boolean`

***

### getToggleGroupingHandler

```ts
getToggleGroupingHandler: () => () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L52)

Returns a function that toggles the grouping state of the column. This is useful for passing to the `onClick` prop of a button.

#### Returns

() => `void`

***

### toggleGrouping

```ts
toggleGrouping: () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L56)

Toggles the grouping state of the column.

#### Returns

`void`
