---
id: DebugOptions
title: DebugOptions
---

# Type Alias: DebugOptions\<TFeatures\>

```ts
type DebugOptions<TFeatures> = object & DebugKeysFor<CoreFeatures & TFeatures>;
```

Defined in: [packages/table-core/src/types/TableOptions.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L41)

## Type Declaration

### debugAll?

```ts
optional debugAll: boolean;
```

### debugCache?

```ts
optional debugCache: boolean;
```

### debugCells?

```ts
optional debugCells: boolean;
```

### debugColumns?

```ts
optional debugColumns: boolean;
```

### debugHeaders?

```ts
optional debugHeaders: boolean;
```

### debugRows?

```ts
optional debugRows: boolean;
```

### debugTable?

```ts
optional debugTable: boolean;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
