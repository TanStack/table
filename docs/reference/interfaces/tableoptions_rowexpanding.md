---
id: TableOptions_RowExpanding
title: TableOptions_RowExpanding
---

# Interface: TableOptions\_RowExpanding\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### autoResetExpanded?

```ts
optional autoResetExpanded: boolean;
```

Enable this setting to automatically reset the expanded state of the table when expanding state changes.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#autoresetexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:55](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L55)

***

### enableExpanding?

```ts
optional enableExpanding: boolean;
```

Enable/disable expanding for all rows.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#enableexpanding)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:61](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L61)

***

### getIsRowExpanded()?

```ts
optional getIsRowExpanded: (row) => boolean;
```

If provided, allows you to override the default behavior of determining whether a row is currently expanded.

#### Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getisrowexpanded)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:67](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L67)

***

### getRowCanExpand()?

```ts
optional getRowCanExpand: (row) => boolean;
```

If provided, allows you to override the default behavior of determining whether a row can be expanded.

#### Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getrowcanexpand)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:73](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L73)

***

### manualExpanding?

```ts
optional manualExpanding: boolean;
```

Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#manualexpanding)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:79](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L79)

***

### onExpandedChange?

```ts
optional onExpandedChange: OnChangeFn<ExpandedState>;
```

This function is called when the `expanded` table state changes. If a function is provided, you will be responsible for managing this state on your own. To pass the managed state back to the table, use the `tableOptions.state.expanded` option.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#onexpandedchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:85](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L85)

***

### paginateExpandedRows?

```ts
optional paginateExpandedRows: boolean;
```

If `true` expanded rows will be paginated along with the rest of the table (which means expanded rows may span multiple pages). If `false` expanded rows will not be considered for pagination (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#paginateexpandedrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:91](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L91)
