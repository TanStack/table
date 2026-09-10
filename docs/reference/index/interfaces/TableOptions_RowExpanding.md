---
id: TableOptions_RowExpanding
title: TableOptions_RowExpanding
---

# Interface: TableOptions\_RowExpanding\<TFeatures, TData\>

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L36)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L43)

Enables automatic expanded-state resets when page-altering table state changes.

***

### enableExpanding?

```ts
optional enableExpanding: boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L47)

Allows rows with subRows to be expanded.

***

### getIsRowExpanded()?

```ts
optional getIsRowExpanded: (row) => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L51)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L55)

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

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L59)

Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.

***

### onExpandedChange?

```ts
optional onExpandedChange: OnChangeFn<ExpandedState>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L65)

Called with an updater when expanded state changes. Pair this with
`state.expanded` when using external state; external atoms can own the
slice without this callback.

***

### paginateExpandedRows?

```ts
optional paginateExpandedRows: boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L69)

If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parent's page). This also means more rows will be rendered than the set page size.
