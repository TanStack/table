import {
  ChangeDetectorRef,
  ComponentRef,
  inject,
  Injectable,
  Injector,
  KeyValueDiffer,
  KeyValueDiffers,
  ViewContainerRef,
} from '@angular/core'
import { FlexRenderComponent } from './flex-render-component'

@Injectable()
export class FlexRenderComponentFactory {
  #viewContainerRef = inject(ViewContainerRef)

  createComponent<T>(
    flexRenderComponent: FlexRenderComponent<T>,
    componentInjector: Injector
  ): FlexRenderComponentRef<T> {
    const componentRef = this.#viewContainerRef.createComponent(
      flexRenderComponent.component,
      {
        injector: componentInjector,
      }
    )

    return new FlexRenderComponentRef(
      componentRef,
      flexRenderComponent,
      componentInjector
    )
  }
}

export class FlexRenderComponentRef<T> {
  readonly #keyValueDiffersFactory: KeyValueDiffers
  #keyValueDiffer: KeyValueDiffer<any, any>

  constructor(
    readonly componentRef: ComponentRef<T>,
    readonly componentData: FlexRenderComponent<T>,
    readonly componentInjector: Injector
  ) {
    this.#keyValueDiffersFactory = componentInjector.get(KeyValueDiffers)
    this.#keyValueDiffer = this.#keyValueDiffersFactory
      .find(this.componentData.inputs ?? {})
      .create()
    this.#keyValueDiffer.diff(this.componentData.inputs ?? {})
  }

  get component() {
    return this.componentData.component
  }

  get inputs() {
    return this.componentData.inputs ?? {}
  }

  /**
   * Get component inputs diff by the given item
   */
  diff(item: FlexRenderComponent<T>) {
    return this.#keyValueDiffer.diff(item.inputs ?? {})
  }

  /**
   *
   * @param compare Whether the current ref component instance is the same as the given one
   */
  eqType(compare: FlexRenderComponent<T>): boolean {
    return compare.component === this.component
  }

  /**
   * Tries to update current component refs input by the new given content component.
   */
  update(content: FlexRenderComponent<T>) {
    const eq = this.eqType(content)
    if (!eq) return
    const changes = this.diff(content)
    if (!changes) return
    changes.forEachAddedItem(item => {
      this.setInput(item.key, item.currentValue)
    })
    changes.forEachChangedItem(item => {
      this.setInput(item.key, item.currentValue)
    })
    changes.forEachRemovedItem(item => {
      this.setInput(item.key, undefined)
    })
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
    if (this.componentData.allowedInputNames.includes(key)) {
      this.componentRef.setInput(key, value)
    }
  }
}
