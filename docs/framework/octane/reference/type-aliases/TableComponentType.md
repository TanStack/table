---
id: TableComponentType
title: TableComponentType
---

# Type Alias: TableComponentType()\<TProps\>

```ts
type TableComponentType<TProps> = (props) => OctaneNode;
```

Defined in: [types.ts:68](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L68)

A component in a `createTableHook` component registry.

Structural on purpose (octane components are plain functions), so registries
accept components declared in `.tsrx`, `.tsx`, or plain `.ts` alike.

## Type Parameters

### TProps

`TProps` = `any`

## Parameters

### props

`TProps`

## Returns

`OctaneNode`
