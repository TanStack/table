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
  \| `"columnSizingInfo"`
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

• **updater**: [`Updater`](../type-aliases/updater.md)\<`object`\[`K`\]\>

### Returns

`void`

## Defined in

[utils.ts:14](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/utils.ts#L14)
