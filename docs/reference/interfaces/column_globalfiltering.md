---
id: Column_GlobalFiltering
title: Column_GlobalFiltering
---

# Interface: Column\_GlobalFiltering

## Properties

### getCanGlobalFilter()

```ts
getCanGlobalFilter: () => boolean;
```

Returns whether or not the column can be **globally** filtered. Set to `false` to disable a column from being scanned during global filtering.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getcanglobalfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)

#### Defined in

[features/global-filtering/GlobalFiltering.types.ts:33](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/global-filtering/GlobalFiltering.types.ts#L33)
