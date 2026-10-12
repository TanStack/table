---
id: FlexRenderComponentInstance
title: FlexRenderComponentInstance
---

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:297](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L297)

Wrapper class for a component that will be used as content for [FlexRenderDirective](FlexRenderDirective.md)

Prefer [flexRenderComponent](../functions/flexRenderComponent.md) for better type-safety.

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
   bindings?,
key?): FlexRenderComponentInstance<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:303](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L303)

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

##### key?

`string` \| `number`

#### Returns

`FlexRenderComponentInstance`\<`TComponent`\>

## Properties

### bindings?

```ts
readonly optional bindings?: Binding[];
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:309](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L309)

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

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:304](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L304)

The component type

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`component`](../interfaces/FlexRenderComponent.md#component)

***

### directives?

```ts
readonly optional directives?: (Type<unknown> | DirectiveWithBindings<unknown>)[];
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:308](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L308)

Directives that should be applied to the component.

#### See

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`directives`](../interfaces/FlexRenderComponent.md#directives)

***

### injector?

```ts
readonly optional injector?: Injector;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:306](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L306)

Optional Injector that will be used when rendering the component.

#### See

FlexRenderOptions#injector

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`injector`](../interfaces/FlexRenderComponent.md#injector)

***

### inputs?

```ts
readonly optional inputs?: Inputs<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:305](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L305)

Component instance inputs. Set via [componentRef.setInput API](https://angular.dev/api/core/ComponentRef#setInput))

#### See

FlexRenderOptions#inputs

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`inputs`](../interfaces/FlexRenderComponent.md#inputs)

***

### key?

```ts
readonly optional key?: string | number;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:310](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L310)

Optional identity used together with the component type to decide whether
an existing component instance can be reused.

#### See

FlexRenderOptions#key

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`key`](../interfaces/FlexRenderComponent.md#key)

***

### metadata

```ts
readonly metadata: ResolvedComponentMetadata<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:301](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L301)

Cached component metadata used by the flex renderer.

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`metadata`](../interfaces/FlexRenderComponent.md#metadata)

***

### mirror

```ts
readonly mirror: ComponentMirror<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:300](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L300)

Reflected metadata about the component.

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`mirror`](../interfaces/FlexRenderComponent.md#mirror)

***

### outputs?

```ts
readonly optional outputs?: Outputs<TComponent>;
```

Defined in: [packages/angular-table/src/flex-render/flexRenderComponent.ts:307](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L307)

Component instance outputs. Subscribed via OutputEmitterRef#subscribe

#### See

FlexRenderOptions#outputs

#### Implementation of

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md).[`outputs`](../interfaces/FlexRenderComponent.md#outputs)
