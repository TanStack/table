import { reflectComponentType } from '@angular/core'
import type {
  Binding,
  ComponentMirror,
  Injector,
  InputSignal,
  OutputEmitterRef,
  Type,
  createComponent,
} from '@angular/core'

type CreateComponentOptions = Parameters<typeof createComponent>[1]
type CreateComponentBindings = CreateComponentOptions['bindings']
type CreateComponentDirectives = CreateComponentOptions['directives']

interface FlexRenderOptions<
  TInputs extends Record<string, any>,
  TOutputs extends Record<string, any>,
> {
  /**
   * Native Angular bindings applied at component creation time via `createComponent`.
   * Use this option to set inputs, outputs, or two-way bindings at creation time.
   * Shouldn't be used together with {@link FlexRenderOptions#inputs} or {@link FlexRenderOptions#outputs} option.
   *
   * Binding input/outputs at creation time: {@link https://angular.dev/guide/components/programmatic-rendering#binding-inputs-outputs-and-setting-host-directives-at-creation}
   *
   * Two-way binding: {@link https://angular.dev/api/core/twoWayBinding}
   *
   * Output binding: {@link https://angular.dev/api/core/outputBinding}
   *
   * Input binding: {@link https://angular.dev/api/core/inputBinding}
   *
   * @example
   * ```ts
   * import {flexRenderComponent} from '@tanstack/angular-table';
   * flexRenderComponent(MyComponent, {
   *   bindings: [
   *     // Will update `value` input every time `mySignalValue` changes
   *     inputBinding('value', mySignalValue),
   *     // Set myProperty to 1 when the component is created
   *     inputBinding('myProperty', () => 1),
   *     // Callback called every time `valueChange` output emit
   *     outputBinding('valueChange', value => {
   *       console.log("my value changed to", value)
   *     }),
   *     // Two-way binding between `value` input and `valueChange` output
   *     // Useful while using `model` inputs.
   *     twoWayBinding('value', mySignal)
   *   ]
   * })
   * ```
   */
  readonly bindings?: Array<Binding>
  /**
   * Directives to apply to the component at creation time.
   *
   * Binding directives at creation time: {@link https://angular.dev/guide/components/programmatic-rendering#binding-inputs-outputs-and-setting-host-directives-at-creation}
   *
   * Two-way binding: {@link https://angular.dev/api/core/twoWayBinding}
   *
   * Output binding: {@link https://angular.dev/api/core/outputBinding}
   *
   * Input binding: {@link https://angular.dev/api/core/inputBinding}
   *
   * @example
   * ```ts
   * import {flexRenderComponent} from '@tanstack/angular-table';
   * flexRenderComponent(MyComponent, {
   *   bindings: [
   *      // ...
   *   ],
   *   directives: [
   *      DirectiveA,
   *      {
   *        type: DirectiveB,
   *        bindings: [
   *          inputBinding('value', mySignalValue),
   *          // ...
   *        ]
   *      }
   *   ]
   * })
   * ```
   */
  readonly directives?: CreateComponentDirectives
  /**
   * Component instance inputs.
   *
   * These values are assigned after the component has been created using
   * [componentRef.setInput API](https://angular.dev/api/core/ComponentRef#setInput).
   *
   * Shouldn't be used together with {@link FlexRenderOptions#bindings} option
   */
  readonly inputs?: TInputs
  /**
   * Component instance outputs.
   *
   * Outputs are wired imperatively after component creation using {@link OutputEmitterRef#subscribe}.
   *
   * Shouldn't be used together with {@link FlexRenderOptions#bindings} option
   */
  readonly outputs?: TOutputs
  /**
   * Optional {@link Injector} that will be used when rendering the component
   */
  readonly injector?: Injector
}

type Inputs<T> = {
  [K in keyof T as T[K] extends InputSignal<infer R>
    ? K
    : never]?: T[K] extends InputSignal<infer R> ? R : never
}

type Outputs<T> = {
  [K in keyof T as T[K] extends OutputEmitterRef<infer R>
    ? K
    : never]?: T[K] extends OutputEmitterRef<infer R>
    ? OutputEmitterRef<R>['emit']
    : never
}

/**
 * Helper function to create a {@link FlexRenderComponent} instance, with better type-safety.
 *
 * @example
 * ```ts
 * import {flexRenderComponent} from '@tanstack/angular-table'
 * import {inputBinding, outputBinding} from '@angular/core';
 *
 * const columns = [
 *   {
 *     cell: ({ row }) => {
 *        return flexRenderComponent(MyComponent, {
 *          inputs: { value: mySignalValue() },
 *          outputs: { valueChange: (val) => {} }
 *          // or using angular native createComponent#binding api
 *          bindings: [
 *            inputBinding('value', mySignalValue),
 *            outputBinding('valueChange', value => {
 *              console.log("my value changed to", value)
 *            })
 *          ]
 *        })
 *     },
 *   },
 * ]
 * ```
 */
export function flexRenderComponent<TComponent = any>(
  component: Type<TComponent>,
  options?: FlexRenderOptions<Inputs<TComponent>, Outputs<TComponent>>,
): FlexRenderComponent<TComponent> {
  const { inputs, injector, outputs, directives, bindings } = options ?? {}
  return new FlexRenderComponentInstance(
    component,
    inputs,
    injector,
    outputs,
    directives,
    bindings,
  )
}

/**
 * Wrapper interface for a component that will be used as content for {@link FlexRenderDirective}.
 * Can be created using {@link flexRenderComponent} helper.
 *
 * @example
 *
 * ```ts
 * import {flexRenderComponent} from '@tanstack/angular-table'
 *
 * // Usage in cell/header/footer definition
 * const columns = [
 *   {
 *     cell: ({ row }) => {
 *        return flexRenderComponent(MyComponent, {
 *          inputs: { value: mySignalValue() },
 *          outputs: { valueChange: (val) => {} }
 *          // or using angular createComponent#bindings api
 *          bindings: [
 *            inputBinding('value', mySignalValue),
 *            outputBinding('valueChange', value => {
 *              console.log("my value changed to", value)
 *            })
 *          ]
 *        })
 *     },
 *   },
 * ]
 *
 * import {input, output} from '@angular/core';
 *
 * @Component({
 *  selector: 'my-component',
 * })
 * class MyComponent {
 *    readonly value = input(0);
 *    readonly valueChange = output<number>();
 * }
 *
 * ```
 */
export interface FlexRenderComponent<TComponent = any> {
  /**
   * The component type
   */
  readonly component: Type<TComponent>
  /**
   * Reflected metadata about the component.
   */
  readonly mirror: ComponentMirror<TComponent>
  /**
   * List of allowed input names.
   */
  readonly allowedInputNames: Array<string>
  /**
   * List of allowed output names.
   */
  readonly allowedOutputNames: Array<string>
  /**
   * Component instance outputs. Subscribed via {@link OutputEmitterRef#subscribe}
   *
   * @see {@link FlexRenderOptions#outputs}
   */
  readonly outputs?: Outputs<TComponent>
  /**
   * Component instance inputs. Set via [componentRef.setInput API](https://angular.dev/api/core/ComponentRef#setInput))
   *
   * @see {@link FlexRenderOptions#inputs}
   */
  readonly inputs?: Inputs<TComponent>
  /**
   * Optional {@link Injector} that will be used when rendering the component.
   *
   * @see {@link FlexRenderOptions#injector}
   */
  readonly injector?: Injector
  /**
   * Bindings to apply to the root component
   *
   * @see {@link FlexRenderOptions#bindings}
   */
  bindings?: CreateComponentBindings
  /**
   * Directives that should be applied to the component.
   *
   * @see {FlexRenderOptions#directives}
   */
  directives?: CreateComponentDirectives
}

/**
 * Wrapper class for a component that will be used as content for {@link FlexRenderDirective}
 *
 * Prefer {@link flexRenderComponent} helper for better type-safety
 */
export class FlexRenderComponentInstance<
  TComponent = any,
> implements FlexRenderComponent<TComponent> {
  readonly mirror: ComponentMirror<TComponent>
  readonly allowedInputNames: Array<string> = []
  readonly allowedOutputNames: Array<string> = []

  constructor(
    readonly component: Type<TComponent>,
    readonly inputs?: Inputs<TComponent>,
    readonly injector?: Injector,
    readonly outputs?: Outputs<TComponent>,
    readonly directives?: CreateComponentDirectives,
    readonly bindings?: CreateComponentBindings,
  ) {
    const mirror = reflectComponentType(component)
    if (!mirror) {
      throw new Error(
        `[@tanstack-table/angular] The provided symbol is not a component`,
      )
    }
    this.mirror = mirror
    for (const input of this.mirror.inputs) {
      this.allowedInputNames.push(input.propName)
    }
    for (const output of this.mirror.outputs) {
      this.allowedOutputNames.push(output.propName)
    }
  }
}
