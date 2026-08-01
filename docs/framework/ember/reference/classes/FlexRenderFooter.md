---
id: FlexRenderFooter
title: FlexRenderFooter
---

# Class: FlexRenderFooter\<TFeatures, TData, TValue\>

Defined in: packages/ember-table/declarations/FlexRender.d.ts:54

## Extends

- `default`\<`FlexRenderFooterSignature`\<`TFeatures`, `TData`, `TValue`\>\>

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData` = `CellData`

## Constructors

### Constructor

```ts
new FlexRenderFooter<TFeatures, TData, TValue>(owner, args): FlexRenderFooter<TFeatures, TData, TValue>;
```

Defined in: node\_modules/.pnpm/@glimmer+component@2.1.1/node\_modules/@glimmer/component/dist/index.d.ts:389

#### Parameters

##### owner

`Owner`

##### args

###### footer

`Header_Core`\<`TFeatures`, `TData`, `TValue`\>

#### Returns

`FlexRenderFooter`\<`TFeatures`, `TData`, `TValue`\>

#### Inherited from

```ts
Component<FlexRenderFooterSignature<TFeatures, TData, TValue>>.constructor
```

## Properties

### \[Context\]

```ts
[Context]: ComponentContext<FlexRenderFooter<TFeatures, TData, TValue>, FlexRenderFooterSignature<TFeatures, TData, TValue>>;
```

Defined in: node\_modules/.pnpm/@glint+ember-tsc@1.8.11\_ember-source@7.0.0\_@glimmer+component@2.1.1\_\_typescript@6.0.3/node\_modules/@glint/ember-tsc/types/-private/dsl/integration-declarations.d.ts:33

#### Inherited from

```ts
Component.[Context]
```

***

### \[Invoke\]()

```ts
[Invoke]: (...args) => ComponentReturn<FlattenBlockParams<{
}>, unknown>;
```

Defined in: node\_modules/.pnpm/@glint+template@1.7.8/node\_modules/@glint/template/-private/integration.d.ts:22

#### Parameters

##### args

...\[`NamedArgs`\<\{
  `footer`: `Header_Core`\<`TFeatures`, `TData`, `TValue`\>;
\}\>\]

#### Returns

`ComponentReturn`\<`FlattenBlockParams`\<\{
\}\>, `unknown`\>

#### Inherited from

```ts
Component.[Invoke]
```

***

### args

```ts
readonly args: Readonly<Args<S>>;
```

Defined in: node\_modules/.pnpm/@glimmer+component@2.1.1/node\_modules/@glimmer/component/dist/-private/component.d.ts:236

Named arguments passed to the component from its parent component.
They can be accessed in JavaScript via `this.args.argumentName` and in the template via `@argumentName`.

Say you have the following component, which will have two `args`, `firstName` and `lastName`:

```hbs
<my-component @firstName="Arthur" @lastName="Dent" />
```

If you needed to calculate `fullName` by combining both of them, you would do:

```ts
didInsertElement() {
  console.log(`Hi, my full name is ${this.args.firstName} ${this.args.lastName}`);
}
```

While in the template you could do:

```hbs
<p>Welcome, {{@firstName}} {{@lastName}}!</p>
```

#### Inherited from

```ts
Component.args
```

## Accessors

### componentOptions

#### Get Signature

```ts
get componentOptions(): RenderOptions;
```

Defined in: packages/ember-table/declarations/FlexRender.d.ts:59

##### Returns

`RenderOptions`

***

### componentToRender

#### Get Signature

```ts
get componentToRender():
  | ComponentLike<HeaderRenderSignature<TFeatures, TData, TValue>>
  | undefined;
```

Defined in: packages/ember-table/declarations/FlexRender.d.ts:58

##### Returns

  \| `ComponentLike`\<`HeaderRenderSignature`\<`TFeatures`, `TData`, `TValue`\>\>
  \| `undefined`

***

### content

#### Get Signature

```ts
get content(): ContentValue;
```

Defined in: packages/ember-table/declarations/FlexRender.d.ts:60

##### Returns

`ContentValue`

***

### isComponent

#### Get Signature

```ts
get isComponent(): boolean;
```

Defined in: packages/ember-table/declarations/FlexRender.d.ts:57

##### Returns

`boolean`

***

### isDestroyed

#### Get Signature

```ts
get isDestroyed(): boolean;
```

Defined in: node\_modules/.pnpm/@glimmer+component@2.1.1/node\_modules/@glimmer/component/dist/-private/component.d.ts:238

##### Returns

`boolean`

#### Inherited from

```ts
Component.isDestroyed
```

***

### isDestroying

#### Get Signature

```ts
get isDestroying(): boolean;
```

Defined in: node\_modules/.pnpm/@glimmer+component@2.1.1/node\_modules/@glimmer/component/dist/-private/component.d.ts:237

##### Returns

`boolean`

#### Inherited from

```ts
Component.isDestroying
```

***

### resolvedContext

#### Get Signature

```ts
get resolvedContext(): HeaderContext<TFeatures, TData, TValue>;
```

Defined in: packages/ember-table/declarations/FlexRender.d.ts:56

##### Returns

`HeaderContext`\<`TFeatures`, `TData`, `TValue`\>

***

### result

#### Get Signature

```ts
get result(): HeaderRenderResult<TFeatures, TData, TValue>;
```

Defined in: packages/ember-table/declarations/FlexRender.d.ts:55

##### Returns

`HeaderRenderResult`\<`TFeatures`, `TData`, `TValue`\>

## Methods

### willDestroy()

```ts
willDestroy(): void;
```

Defined in: node\_modules/.pnpm/@glimmer+component@2.1.1/node\_modules/@glimmer/component/dist/-private/component.d.ts:242

Called before the component has been removed from the DOM.

#### Returns

`void`

#### Inherited from

```ts
Component.willDestroy
```
