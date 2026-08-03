---
id: SubscribePropsWithSourceIdentity
title: SubscribePropsWithSourceIdentity
---

# Type Alias: SubscribePropsWithSourceIdentity\<TSourceValue\>

```ts
type SubscribePropsWithSourceIdentity<TSourceValue> = object;
```

Defined in: [Subscribe.ts:39](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L39)

Subscribe to the full value of a source (e.g. `table.atoms.rowSelection` or
`table.optionsStore`). Omitting `selector` is equivalent to the identity
selector — children receive `TSourceValue`.

## Type Parameters

### TSourceValue

`TSourceValue`

## Properties

### children

```ts
children: (state) => ComponentChildren | ComponentChildren;
```

Defined in: [Subscribe.ts:42](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L42)

***

### selector?

```ts
optional selector: undefined;
```

Defined in: [Subscribe.ts:41](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L41)

***

### source

```ts
source: SubscribeSource<TSourceValue>;
```

Defined in: [Subscribe.ts:40](https://github.com/TanStack/table/blob/main/packages/preact-table/src/Subscribe.ts#L40)
