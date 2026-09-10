---
id: LegacyFeatures
title: LegacyFeatures
---

# Interface: LegacyFeatures

Defined in: [react-table/src/useLegacyTable.ts:168](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L168)

Feature set registered by `useLegacyTable`.

Extends the stock features with the built-in filter, sort, and aggregation
registries so column definitions accept the v8 string identifiers such as
`'mean'` and `'includesString'`.

## Extends

- `StockFeatures`

## Properties

### aggregationFns

```ts
aggregationFns: object;
```

Defined in: [react-table/src/useLegacyTable.ts:169](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L169)

#### range

```ts
range: AggregationFnDef<TableFeatures, RowData, unknown, number>;
```

***

### filterFns

```ts
filterFns: object;
```

Defined in: [react-table/src/useLegacyTable.ts:170](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L170)

#### startsWithLetter

```ts
startsWithLetter: FilterFn<TableFeatures, RowData>;
```

***

### sortFns

```ts
sortFns: object;
```

Defined in: [react-table/src/useLegacyTable.ts:171](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L171)

#### byNameLength

```ts
byNameLength: SortFn<TableFeatures, RowData>;
```
