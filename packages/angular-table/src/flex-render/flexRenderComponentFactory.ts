import {
  ChangeDetectorRef,
  ComponentRef,
  Injectable,
  Injector,
  OutputEmitterRef,
  OutputRefSubscription,
  ViewContainerRef,
} from '@angular/core'
import { hasOwn } from '@tanstack/table-core'
import type { FlexRenderComponent } from './flexRenderComponent'

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
      this.setInput(prop, inputs[prop])
    }
  }

  setInput(key: string, value: unknown) {
    const inputName = this.#componentData.metadata.inputNames.get(key)
    if (inputName === undefined) return
    this.componentRef.setInput(inputName, value)
  }

  setOutputs(
    outputs: Record<
      string,
      OutputEmitterRef<unknown>['emit'] | null | undefined
    >,
  ) {
    this.#outputRegistry.unsubscribeAll()
    for (const prop in outputs) {
      this.setOutput(prop, outputs[prop])
    }
  }

  setOutput(
    key: string,
    emit: OutputEmitterRef<unknown>['emit'] | undefined | null,
  ): void {
    if (!this.#componentData.metadata.outputNames.has(key)) return
    const outputName = key
    if (!emit) {
      this.#outputRegistry.unsubscribe(outputName)
      return
    }

    // If the output was already subscribed, just swap the listener callback.
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

  #syncInputs(newInputs: Record<string, unknown>): void {
    // Inputs use patch semantics: omitted keys keep their current value, while
    // an explicitly provided `undefined` is forwarded to Angular.
    for (const prop in newInputs) {
      if (hasOwn(newInputs, prop)) {
        this.setInput(prop, newInputs[prop])
      }
    }
  }

  #syncOutputs(
    outputs: Record<
      string,
      OutputEmitterRef<unknown>['emit'] | null | undefined
    >,
  ): void {
    const outputKeys = Object.keys(outputs)
    const currentSubscribedKeys = this.#outputRegistry.getSubscribedKeys()
    // When outputs updates, unsubscribe missing keys
    for (const key of currentSubscribedKeys) {
      if (!outputKeys.includes(key)) {
        this.#outputRegistry.unsubscribe(key)
      }
    }
    for (const prop in outputs) {
      this.setOutput(prop, outputs[prop])
    }
  }
}

class FlexRenderComponentOutputManager {
  readonly #outputSubscribers = new Map<string, OutputRefSubscription>()
  readonly #outputListeners = new Map<string, (...args: Array<any>) => void>()

  getSubscribedKeys() {
    return Array.from(this.#outputListeners.keys())
  }

  hasSubscription(outputName: string) {
    return this.#outputSubscribers.has(outputName)
  }

  setListener(outputName: string, callback: (...args: Array<any>) => void) {
    this.#outputListeners.set(outputName, callback)
  }

  getListener(outputName: string) {
    return this.#outputListeners.get(outputName)
  }

  setSubscription(
    outputName: string,
    subscription: OutputRefSubscription,
  ): void {
    this.#outputSubscribers.set(outputName, subscription)
  }

  unsubscribeAll(): void {
    for (const outputName of this.#outputListeners.keys()) {
      this.unsubscribe(outputName)
    }
  }

  unsubscribe(outputName: string) {
    this.#outputSubscribers.get(outputName)?.unsubscribe()
    this.#outputSubscribers.delete(outputName)
    this.#outputListeners.delete(outputName)
  }
}
