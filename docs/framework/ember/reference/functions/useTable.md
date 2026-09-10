---
id: useTable
title: useTable
---

# Function: useTable()

## Call Signature

```ts
function useTable<TFeatures, TData>(owner, getOptions): Table<TFeatures, TData>;
```

Defined in: packages/ember-table/declarations/use-table.d.ts:10

Creates an Ember-reactive table.

Pass the containing component (or another Ember destroyable) as the first
argument to tie external-atom subscriptions to its lifecycle. The one-arg
form remains available for standalone tables that do not have an Ember
owner.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

### Parameters

#### owner

`object`

#### getOptions

() => `TableOptions`\<`TFeatures`, `TData`\>

### Returns

`Table`\<`TFeatures`, `TData`\>

## Call Signature

```ts
function useTable<TFeatures, TData>(getOptions): Table<TFeatures, TData>;
```

Defined in: packages/ember-table/declarations/use-table.d.ts:11

Creates an Ember-reactive table.

Pass the containing component (or another Ember destroyable) as the first
argument to tie external-atom subscriptions to its lifecycle. The one-arg
form remains available for standalone tables that do not have an Ember
owner.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TData

`TData` *extends* `RowData`

### Parameters

#### getOptions

() => `TableOptions`\<`TFeatures`, `TData`\>

### Returns

`Table`\<`TFeatures`, `TData`\>
