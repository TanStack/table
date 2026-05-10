---
id: subscribeTable
title: subscribeTable
---

# Function: subscribeTable()

## Call Signature

```ts
function subscribeTable<TSourceValue>(source): object;
```

Defined in: [packages/svelte-table/src/subscribe.ts:34](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/subscribe.ts#L34)

Creates a fine-grained Svelte subscription to a TanStack Store source.

Pass a table atom or store and optionally project it with a selector. The
returned selector store exposes `.current`, making it useful for reading
focused table state outside the broad `createTable` selector.

### Type Parameters

#### TSourceValue

`TSourceValue`

### Parameters

#### source

[`SubscribeSource`](../type-aliases/SubscribeSource.md)\<`TSourceValue`\>

### Returns

`object`

#### current

```ts
readonly current: NoInfer<TSourceValue>;
```

### Example

```svelte
<script lang="ts">
  const selected = subscribeTable(
    table.atoms.rowSelection,
    (rowSelection) => rowSelection[row.id],
  )
</script>

<input type="checkbox" checked={!!selected.current} />
```

## Call Signature

```ts
function subscribeTable<TSourceValue, TSelected>(source, selector): object;
```

Defined in: [packages/svelte-table/src/subscribe.ts:37](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/subscribe.ts#L37)

Creates a fine-grained Svelte subscription to a TanStack Store source.

Pass a table atom or store and optionally project it with a selector. The
returned selector store exposes `.current`, making it useful for reading
focused table state outside the broad `createTable` selector.

### Type Parameters

#### TSourceValue

`TSourceValue`

#### TSelected

`TSelected`

### Parameters

#### source

[`SubscribeSource`](../type-aliases/SubscribeSource.md)\<`TSourceValue`\>

#### selector

(`state`) => `TSelected`

### Returns

`object`

#### current

```ts
readonly current: TSelected;
```

### Example

```svelte
<script lang="ts">
  const selected = subscribeTable(
    table.atoms.rowSelection,
    (rowSelection) => rowSelection[row.id],
  )
</script>

<input type="checkbox" checked={!!selected.current} />
```
