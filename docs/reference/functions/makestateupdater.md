---
id: makeStateUpdater
title: makeStateUpdater
---

# Function: makeStateUpdater()

```ts
function makeStateUpdater<K>(key, instance): (updater) => void
```

## Type Parameters

• **K** *extends* 
  \| `"columnFilters"`
  \| `"grouping"`
  \| `"columnOrder"`
  \| `"columnPinning"`
  \| `"columnResizing"`
  \| `"columnSizing"`
  \| `"columnVisibility"`
  \| `"globalFilter"`
  \| `"expanded"`
  \| `"pagination"`
  \| `"rowPinning"`
  \| `"rowSelection"`
  \| `"sorting"`

## Parameters

• **key**: `K`

• **instance**: `unknown`

## Returns

`Function`

### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`TableState`](../type-aliases/tablestate.md)\<`any`\>\[`K`\]\>

### Returns

`void`

## Defined in

[utils.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L20)
