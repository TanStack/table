---
id: flattenBy
title: flattenBy
---

# Function: flattenBy()

```ts
function flattenBy<TNode>(arr, getChildren): TNode[];
```

Defined in: [utils.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L131)

Flattens a tree of nodes by recursively reading child nodes.

The original nodes are preserved in depth-first order.

## Type Parameters

### TNode

`TNode`

## Parameters

### arr

`TNode`[]

### getChildren

(`item`) => `TNode`[]

## Returns

`TNode`[]
