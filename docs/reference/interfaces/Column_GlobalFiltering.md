---
id: Column_GlobalFiltering
title: Column_GlobalFiltering
---

# Interface: Column\_GlobalFiltering

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L25)

## Properties

### getCanGlobalFilter()

```ts
getCanGlobalFilter: () => boolean;
```

Defined in: [packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.types.ts#L29)

Returns whether or not the column can be **globally** filtered. Set to `false` to disable a column from being scanned during global filtering.

#### Returns

`boolean`
