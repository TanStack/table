---
id: SubscribeDirective
title: SubscribeDirective
---

# Class: SubscribeDirective

Defined in: [packages/lit-table/src/subscribe-directive.ts:46](https://github.com/TanStack/table/blob/main/packages/lit-table/src/subscribe-directive.ts#L46)

An asynchronous Lit directive that subscribes to a `@tanstack/lit-store`
source and triggers re-renders specifically for the template portion it wraps.
* It uses a "fake" `ReactiveControllerHost` to bridge the gap between
TanStack's standard controller requirements and the `AsyncDirective` lifecycle.

## Extends

- `AsyncDirective`

## Constructors

### Constructor

```ts
new SubscribeDirective(_partInfo): SubscribeDirective;
```

Defined in: node\_modules/.pnpm/lit-html@3.3.3/node\_modules/lit-html/development/directive.d.ts:61

#### Parameters

##### \_partInfo

`PartInfo`

#### Returns

`SubscribeDirective`

#### Inherited from

```ts
AsyncDirective.constructor
```

## Properties

### isConnected

```ts
isConnected: boolean;
```

Defined in: node\_modules/.pnpm/lit-html@3.3.3/node\_modules/lit-html/development/async-directive.d.ts:143

The connection state for this Directive.

#### Inherited from

```ts
AsyncDirective.isConnected
```

## Accessors

### \_$isConnected

#### Get Signature

```ts
get _$isConnected(): boolean;
```

Defined in: node\_modules/.pnpm/lit-html@3.3.3/node\_modules/lit-html/development/directive.d.ts:62

##### Returns

`boolean`

#### Inherited from

```ts
AsyncDirective._$isConnected
```

## Methods

### \_$initialize()

```ts
_$initialize(
   part,
   parent,
   attributeIndex): void;
```

Defined in: node\_modules/.pnpm/lit-html@3.3.3/node\_modules/lit-html/development/async-directive.d.ts:150

Initialize the part with internal fields

#### Parameters

##### part

`Part`

##### parent

`Disconnectable`

##### attributeIndex

`number` | `undefined`

#### Returns

`void`

#### Inherited from

```ts
AsyncDirective._$initialize
```

***

### disconnected()

```ts
disconnected(): void;
```

Defined in: [packages/lit-table/src/subscribe-directive.ts:150](https://github.com/TanStack/table/blob/main/packages/lit-table/src/subscribe-directive.ts#L150)

Cleans up the controller subscription when the directive is removed from the DOM.

#### Returns

`void`

#### Overrides

```ts
AsyncDirective.disconnected
```

***

### reconnected()

```ts
reconnected(): void;
```

Defined in: [packages/lit-table/src/subscribe-directive.ts:155](https://github.com/TanStack/table/blob/main/packages/lit-table/src/subscribe-directive.ts#L155)

Restores the controller subscription when the directive is re-attached to the DOM.

#### Returns

`void`

#### Overrides

```ts
AsyncDirective.reconnected
```

***

### render()

#### Call Signature

```ts
render<TSource>(source, template): unknown;
```

Defined in: [packages/lit-table/src/subscribe-directive.ts:64](https://github.com/TanStack/table/blob/main/packages/lit-table/src/subscribe-directive.ts#L64)

Renders the entire state of the source without a selector.

##### Type Parameters

###### TSource

`TSource`

##### Parameters

###### source

[`SelectionSource`](../type-aliases/SelectionSource.md)\<`TSource`\>

The store or atom to subscribe to.

###### template

`TemplateFunction`\<`TSource`\>

The render function receiving the full state.

##### Returns

`unknown`

##### Overrides

```ts
AsyncDirective.render
```

#### Call Signature

```ts
render<TSource, TSelected>(
   source,
   selector,
   template): unknown;
```

Defined in: [packages/lit-table/src/subscribe-directive.ts:75](https://github.com/TanStack/table/blob/main/packages/lit-table/src/subscribe-directive.ts#L75)

Renders a specific slice of state derived via a selector function.

##### Type Parameters

###### TSource

`TSource`

###### TSelected

`TSelected`

##### Parameters

###### source

[`SelectionSource`](../type-aliases/SelectionSource.md)\<`TSource`\>

The store or atom to subscribe to.

###### selector

`Selector`\<`TSource`, `TSelected`\>

A function to extract the relevant slice of state.

###### template

`TemplateFunction`\<`TSelected`\>

The render function receiving the selected state slice.

##### Returns

`unknown`

##### Overrides

```ts
AsyncDirective.render
```

***

### setValue()

```ts
setValue(value): void;
```

Defined in: node\_modules/.pnpm/lit-html@3.3.3/node\_modules/lit-html/development/async-directive.d.ts:161

Sets the value of the directive's Part outside the normal `update`/`render`
lifecycle of a directive.

This method should not be called synchronously from a directive's `update`
or `render`.

#### Parameters

##### value

`unknown`

The value to set

#### Returns

`void`

#### Inherited from

```ts
AsyncDirective.setValue
```

***

### update()

```ts
update(_part, args): unknown;
```

Defined in: [packages/lit-table/src/subscribe-directive.ts:90](https://github.com/TanStack/table/blob/main/packages/lit-table/src/subscribe-directive.ts#L90)

#### Parameters

##### \_part

`Part`

##### args

\[[`SelectionSource`](../type-aliases/SelectionSource.md)\<`any`\>, `TemplateFunction`\<`any`\>\] | \[[`SelectionSource`](../type-aliases/SelectionSource.md)\<`any`\>, `Selector`\<`any`, `any`\>, `TemplateFunction`\<`any`\>\]

#### Returns

`unknown`

#### Overrides

```ts
AsyncDirective.update
```
