---
id: CreateTableHookOptions
title: CreateTableHookOptions
---

# Type Alias: CreateTableHookOptions\<TFeatures\>

```ts
type CreateTableHookOptions<TFeatures> = Omit<TableOptions<TFeatures, any>, "columns" | "data" | "state">;
```

Defined in: packages/ember-table/declarations/create-table-hook.d.ts:3

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`
