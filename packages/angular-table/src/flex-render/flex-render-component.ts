import {
  ComponentMirror,
  Injector,
  input,
  InputSignal,
  reflectComponentType,
  Type,
} from '@angular/core'

type Inputs<T> = {
  [K in keyof T as T[K] extends InputSignal<infer R>
    ? K
    : never]?: T[K] extends InputSignal<infer R> ? R : never
}

type OptionalKeys<T, K = keyof T> = K extends keyof T
  ? T[K] extends Required<T>[K]
    ? undefined extends T[K]
      ? K
      : never
    : K
  : never

interface FlexRenderRequiredOptions<TInputs extends Record<string, any>> {
  /**
   * Component instance inputs. They will be set via [componentRef.setInput API](https://angular.dev/api/core/ComponentRef#setInput)
   */
  inputs: TInputs
  /**
   * Optional {@link Injector} that will be used when rendering the component
   */
  injector?: Injector
}

interface FlexRenderOptions<TInputs extends Record<string, any>> {
  /**
   * Component instance inputs. They will be set via [componentRef.setInput API](https://angular.dev/api/core/ComponentRef#setInput)
   */
  inputs?: TInputs
  /**
   * Optional {@link Injector} that will be used when rendering the component
   */
  injector?: Injector
}

/**
 * Helper function to create a [@link FlexRenderComponent] instance, with better type-safety.
 *
 * - options object must be passed when the given component instance contains at least one required signal input.
 * - options/inputs is typed with the given component inputs
 */
export function flexRenderComponent<
  TComponent = any,
  TInputs extends Inputs<TComponent> = Inputs<TComponent>,
>(
  component: Type<TComponent>,
  ...options: OptionalKeys<TInputs> extends never
    ? [FlexRenderOptions<TInputs>?]
    : [FlexRenderRequiredOptions<TInputs>]
) {
  const { inputs, injector } = options?.[0] ?? {}
  return new FlexRenderComponent(component, inputs, injector)
}

/**
 * Wrapper class for a component that will be used as content for {@link FlexRenderDirective}
 *
 * Prefer {@link flexRenderComponent} helper for better type-safety
 */
export class FlexRenderComponent<TComponent = any> {
  readonly mirror: ComponentMirror<TComponent>
  readonly allowedInputNames: string[] = []

  constructor(
    readonly component: Type<TComponent>,
    readonly inputs?: Inputs<TComponent>,
    readonly injector?: Injector
  ) {
    const mirror = reflectComponentType(component)
    if (!mirror) {
      throw new Error(
        `[@tanstack-table/angular] The provided symbol is not a component`
      )
    }
    this.mirror = mirror
    for (const input of this.mirror.inputs) {
      this.allowedInputNames.push(input.propName)
    }
  }
}
