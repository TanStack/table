import {
  ChangeDetectorRef,
  ComponentRef,
  Injectable,
  Injector,
  OutputEmitterRef,
  OutputRefSubscription,
  ViewContainerRef,
} from '@angular/core'
import { FlexRenderComponent } from './flexRenderComponent'
import type { Type } from '@angular/core'

const inputNameCache = new WeakMap<Type<unknown>, Map<string, string>>()
const hasOwn = (value: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(value, key)

function getInputName<T>(
  componentData: FlexRenderComponent<T>,
  propName: string,
): string | undefined {
  let names = inputNameCache.get(componentData.component)
  if (!names) {
    names = new Map(
      componentData.mirror.inputs.map((input) => [
        input.propName,
        input.templateName,
      ]),
    )
    inputNameCache.set(componentData.component, names)
  }
  return names.get(propName)
}

/**
 * Creates and manages Angular component instances used by flex-rendered table
 * content.
 */
@Injectable()
export class FlexRenderComponentFactory {
  readonly #viewContainerRef: ViewContainerRef

  constructor(viewContainerRef: ViewContainerRef) {
    this.#viewContainerRef = viewContainerRef
  }

  createComponent<T>(
    flexRenderComponent: FlexRenderComponent<T>,
    componentInjector: Injector,
  ): FlexRenderComponentRef<T> {
    const componentRef = this.#viewContainerRef.createComponent(
      flexRenderComponent.component,
      {
        injector: componentInjector,
        directives: flexRenderComponent.directives,
        bindings: flexRenderComponent.bindings,
      },
    )
    const view = new FlexRenderComponentRef(
      componentRef,
      flexRenderComponent,
      componentInjector,
    )

    const { inputs, outputs } = flexRenderComponent

    if (inputs) view.setInputs(inputs)
    if (outputs) view.setOutputs(outputs)

    return view
  }
}

/**
 * Runtime wrapper around an Angular component rendered by `FlexRenderDirective`.
 *
 * It diffs inputs and outputs across table updates so component renderers can
 * be reused instead of recreated on every cell/header render.
 */
export class FlexRenderComponentRef<T> {
  #componentData: FlexRenderComponent<T>
  readonly #inputValues: Record<string, unknown> = {}
  readonly #creationKey: FlexRenderComponent<T>['key']
  readonly #outputRegistry: FlexRenderComponentOutputManager

  constructor(
    readonly componentRef: ComponentRef<T>,
    componentData: FlexRenderComponent<T>,
    readonly componentInjector: Injector,
  ) {
    this.#componentData = componentData
    this.#creationKey = componentData.key
    this.#outputRegistry = new FlexRenderComponentOutputManager()

    this.componentRef.onDestroy(() => this.#outputRegistry.unsubscribeAll())
  }

  get component() {
    return this.#componentData.component
  }

  get inputs() {
    return this.#componentData.inputs ?? {}
  }

  get outputs() {
    return this.#componentData.outputs ?? {}
  }

  /**
   *
   * @param compare Whether the current ref component instance is the same as the given one
   */
  eqType(compare: FlexRenderComponent<T>): boolean {
    return compare.component === this.component
  }

  canReuse(compare: FlexRenderComponent<T>): boolean {
    return this.eqType(compare) && Object.is(compare.key, this.#creationKey)
  }

  /**
   * Tries to update current component refs input by the new given content component.
   */
  update(content: FlexRenderComponent<T>): void {
    if (!this.canReuse(content)) return

    this.#syncInputs(content.inputs ?? {})
    this.#syncOutputs(content.outputs ?? {})

    this.#componentData = content
  }

  markAsDirty(): void {
    this.componentRef.injector.get(ChangeDetectorRef).markForCheck()
  }

  setInputs(inputs: Record<string, unknown>) {
    for (const prop in inputs) {
      if (hasOwn(inputs, prop)) {
        this.setInput(prop, inputs[prop])
      }
    }
  }

  updateInputs(inputs: Record<string, unknown>): void {
    this.#syncInputs(inputs)
  }

  setInput(key: string, value: unknown) {
    const inputName = getInputName(this.#componentData, key)
    if (inputName) {
      this.componentRef.setInput(inputName, value)
      this.#inputValues[key] = value
    }
  }

  setOutputs(
    outputs: Record<
      string,
      OutputEmitterRef<unknown>['emit'] | null | undefined
    >,
  ) {
    this.#outputRegistry.unsubscribeAll()
    for (const prop in outputs) {
      if (hasOwn(outputs, prop)) {
        this.setOutput(prop, outputs[prop])
      }
    }
  }

  setOutput(
    outputName: string,
    emit: OutputEmitterRef<unknown>['emit'] | undefined | null,
  ): void {
    if (!this.#componentData.allowedOutputNames.includes(outputName)) return
    if (!emit) {
      this.#outputRegistry.unsubscribe(outputName)
      return
    }

    const hasSubscription = this.#outputRegistry.hasSubscription(outputName)
    this.#outputRegistry.setListener(outputName, emit)

    if (hasSubscription) {
      return
    }

    const instance = this.componentRef.instance
    const output = instance[outputName as keyof typeof instance]
    if (output && output instanceof OutputEmitterRef) {
      this.#outputRegistry.setSubscription(
        outputName,
        output.subscribe((value) => {
          this.#outputRegistry.getListener(outputName)?.(value)
        }),
      )
    }
  }

  #syncInputs(inputs: Record<string, unknown>): void {
    for (const prop in inputs) {
      if (
        hasOwn(inputs, prop) &&
        (!hasOwn(this.#inputValues, prop) ||
          !Object.is(this.#inputValues[prop], inputs[prop]))
      ) {
        this.setInput(prop, inputs[prop])
      }
    }
    for (const prop in this.#inputValues) {
      if (!hasOwn(inputs, prop)) {
        const inputName = getInputName(this.#componentData, prop)
        if (inputName) {
          this.componentRef.setInput(inputName, undefined)
        }
        delete this.#inputValues[prop]
      }
    }
  }

  #syncOutputs(
    outputs: Record<
      string,
      OutputEmitterRef<unknown>['emit'] | null | undefined
    >,
  ): void {
    for (const prop in outputs) {
      if (
        hasOwn(outputs, prop) &&
        !Object.is(this.#outputRegistry.getListener(prop), outputs[prop])
      ) {
        this.setOutput(prop, outputs[prop])
      }
    }
    this.#outputRegistry.unsubscribeMissing(outputs)
  }
}

class FlexRenderComponentOutputManager {
  readonly #outputSubscribers: Record<string, OutputRefSubscription> = {}
  readonly #outputListeners: Record<string, (...args: Array<any>) => void> = {}

  hasSubscription(outputName: string) {
    return outputName in this.#outputSubscribers
  }

  setListener(outputName: string, callback: (...args: Array<any>) => void) {
    this.#outputListeners[outputName] = callback
  }

  getListener(outputName: string) {
    return this.#outputListeners[outputName]
  }

  setSubscription(
    outputName: string,
    subscription: OutputRefSubscription,
  ): void {
    this.#outputSubscribers[outputName] = subscription
  }

  unsubscribeAll(): void {
    for (const prop in this.#outputListeners) {
      this.unsubscribe(prop)
    }
  }

  unsubscribeMissing(outputs: Record<string, unknown>): void {
    for (const prop in this.#outputListeners) {
      if (!hasOwn(outputs, prop)) {
        this.unsubscribe(prop)
      }
    }
  }

  unsubscribe(outputName: string) {
    this.#outputSubscribers[outputName]?.unsubscribe()
    delete this.#outputSubscribers[outputName]
    delete this.#outputListeners[outputName]
  }
}
