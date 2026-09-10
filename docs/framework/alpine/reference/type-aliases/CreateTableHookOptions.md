---
id: CreateTableHookOptions
title: CreateTableHookOptions
---

```ts
type CreateTableHookOptions<TFeatures> = Omit<TableOptions<TFeatures, any>, "columns" | "data" | "state">;
```

Defined in: [createTableHook.ts:11](https://github.com/TanStack/table/blob/main/packages/alpine-table/src/createTableHook.ts#L11)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`
