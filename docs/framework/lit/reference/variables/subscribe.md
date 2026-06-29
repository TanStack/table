---
id: subscribe
title: subscribe
---

# Variable: subscribe()

```ts
const subscribe: {
<TSource>  (source, template): DirectiveResult<typeof SubscribeDirective>;
<TSource, TSelected>  (source, selector, template): DirectiveResult<typeof SubscribeDirective>;
};
```

Defined in: [packages/lit-table/src/subscribe-directive.ts:182](https://github.com/TanStack/table/blob/main/packages/lit-table/src/subscribe-directive.ts#L182)

A Lit directive that subscribes to a source (Store or Atom)
and efficiently updates only the wrapped template
when the state or selected slice changes.

## Call Signature

```ts
<TSource>(source, template): DirectiveResult<typeof SubscribeDirective>;
```

Subscribes to the entire source state without filtering.

### Type Parameters

#### TSource

`TSource`

### Parameters

#### source

[`SelectionSource`](../type-aliases/SelectionSource.md)\<`TSource`\>

#### template

`TemplateFunction`\<`TSource`\>

### Returns

`DirectiveResult`\<*typeof* [`SubscribeDirective`](../classes/SubscribeDirective.md)\>

## Call Signature

```ts
<TSource, TSelected>(
   source, 
   selector, 
template): DirectiveResult<typeof SubscribeDirective>;
```

Subscribes to a specific slice of the source state via a selector,
preventing unnecessary re-renders when other parts of the state change.

### Type Parameters

#### TSource

`TSource`

#### TSelected

`TSelected`

### Parameters

#### source

[`SelectionSource`](../type-aliases/SelectionSource.md)\<`TSource`\>

#### selector

`Selector`\<`TSource`, `TSelected`\>

#### template

`TemplateFunction`\<`TSelected`\>

### Returns

`DirectiveResult`\<*typeof* [`SubscribeDirective`](../classes/SubscribeDirective.md)\>

## Example

```ts
// Without a selector (subscribes to entire state)
html`<div>${subscribe(myStore, (state) => html`<span>${state.count}</span>`)}</div>`
* // With a selector (only updates when `count` changes)
html`<div>${subscribe(myStore, state => state.count, (count) => html`<span>${count}</span>`)}</div>`
```
