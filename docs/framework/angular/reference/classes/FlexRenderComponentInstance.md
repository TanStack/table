---
id: FlexRenderComponentInstance
title: FlexRenderComponentInstance
---

# Class: FlexRenderComponentInstance\<TComponent\>

Defined in: [flex-render/flexRenderComponent.ts:259](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L259)

Wrapper class for a component that will be used as content for [FlexRenderDirective](FlexRenderDirective.md)

Prefer [flexRenderComponent](../functions/flexRenderComponent.md) helper for better type-safety

## Type Parameters

### TComponent

`TComponent` = `any`

## Implements

- [`FlexRenderComponent`](../interfaces/FlexRenderComponent.md)\<`TComponent`\>

## Constructors

### Constructor

```ts
new FlexRenderComponentInstance<TComponent>(
   component, 
   inputs?, 
   injector?, 
   outputs?, 
   directives?, 
bindings?): FlexRenderComponentInstance<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:266](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L266)

#### Parameters

##### component

`Type`\<`TComponent`\>

##### inputs?

`Inputs`\<`TComponent`\>

##### injector?

`Injector`

##### outputs?

`Outputs`\<`TComponent`\>

##### directives?

(`Type`\<`unknown`\> \| `DirectiveWithBindings`\<`unknown`\>)[]

##### bindings?

`Binding`[]

#### Returns

`FlexRenderComponentInstance`\<`TComponent`\>

## Properties

### allowedInputNames

```ts
readonly allowedInputNames: string[] = [];
```

Defined in: [flex-render/flexRenderComponent.ts:263](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L263)

List of allowed input names.

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`allowedInputNames`](../interfaces/FlexRenderComponent.md#allowedinputnames)

***

### allowedOutputNames

```ts
readonly allowedOutputNames: string[] = [];
```

Defined in: [flex-render/flexRenderComponent.ts:264](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L264)

List of allowed output names.

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`allowedOutputNames`](../interfaces/FlexRenderComponent.md#allowedoutputnames)

***

### bindings?

```ts
readonly optional bindings: Binding[];
```

Defined in: [flex-render/flexRenderComponent.ts:272](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L272)

Bindings to apply to the root component

#### See

FlexRenderOptions#bindings

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`bindings`](../interfaces/FlexRenderComponent.md#bindings)

***

### component

```ts
readonly component: Type<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:267](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L267)

The component type

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`component`](../interfaces/FlexRenderComponent.md#component)

***

### directives?

```ts
readonly optional directives: (Type<unknown> | DirectiveWithBindings<unknown>)[];
```

Defined in: [flex-render/flexRenderComponent.ts:271](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L271)

Directives that should be applied to the component.

#### See

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`directives`](../interfaces/FlexRenderComponent.md#directives)

***

### injector?

```ts
readonly optional injector: Injector;
```

Defined in: [flex-render/flexRenderComponent.ts:269](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L269)

Optional Injector that will be used when rendering the component.

#### See

FlexRenderOptions#injector

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`injector`](../interfaces/FlexRenderComponent.md#injector)

***

### inputs?

```ts
readonly optional inputs: Inputs<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:268](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L268)

Component instance inputs. Set via [componentRef.setInput API](https://angular.dev/api/core/ComponentRef#setInput))

#### See

FlexRenderOptions#inputs

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`inputs`](../interfaces/FlexRenderComponent.md#inputs)

***

### mirror

```ts
readonly mirror: ComponentMirror<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:262](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L262)

Reflected metadata about the component.

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`mirror`](../interfaces/FlexRenderComponent.md#mirror)

***

### outputs?

```ts
readonly optional outputs: Outputs<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:270](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L270)

Component instance outputs. Subscribed via OutputEmitterRef#subscribe

#### See

FlexRenderOptions#outputs

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`outputs`](../interfaces/FlexRenderComponent.md#outputs)
