---
id: TableOptions_RowExpanding
title: TableOptions_RowExpanding
---

# Interface: TableOptions\_RowExpanding\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L37)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### autoResetExpanded?

```ts
optional autoResetExpanded: boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L44)

Enable this setting to automatically reset the expanded state of the table when expanding state changes.

***

### enableExpanding?

```ts
optional enableExpanding: boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L48)

Enable/disable expanding for all rows.

***

### getIsRowExpanded()?

```ts
optional getIsRowExpanded: (row) => boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L52)

If provided, allows you to override the default behavior of determining whether a row is currently expanded.

#### Parameters

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`boolean`

***

### getRowCanExpand()?

```ts
optional getRowCanExpand: (row) => boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L56)

If provided, allows you to override the default behavior of determining whether a row can be expanded.

#### Parameters

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`boolean`

***

### manualExpanding?

```ts
optional manualExpanding: boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L60)

Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.

***

### onExpandedChange?

```ts
optional onExpandedChange: OnChangeFn<ExpandedState>;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L64)

This function is called when the `expanded` table state changes. If a function is provided, you will be responsible for managing this state on your own. To pass the managed state back to the table, use the `tableOptions.state.expanded` option.

***

### paginateExpandedRows?

```ts
optional paginateExpandedRows: boolean;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L68)

If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size)
