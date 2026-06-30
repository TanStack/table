---
id: CreateTableHookOptions
title: CreateTableHookOptions
---

# Type Alias: CreateTableHookOptions\<TFeatures\>

```ts
type CreateTableHookOptions<TFeatures> = Omit<TableOptions<TFeatures, any>, "columns" | "data" | "state">;
```

Defined in: [createTableHook.ts:6](https://github.com/TanStack/table/blob/main/packages/alpine-table/src/createTableHook.ts#L6)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`
