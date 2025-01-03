import {
  ComponentMirror,
  inject,
  InjectionToken,
  Injector,
  InputSignal,
  reflectComponentType,
  Type,
} from '@angular/core'

type Inputs<T> = {
  [K in keyof T as T[K] extends InputSignal<infer R>
    ? K
    : never]: T[K] extends InputSignal<infer R> ? R : never
}

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
