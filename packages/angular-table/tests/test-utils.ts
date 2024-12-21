import { SIGNAL, signalSetFn } from '@angular/core/primitives/signals'
import type { InputSignal } from '@angular/core'
import type { ComponentFixture } from '@angular/core/testing'

type ToSignalInputUpdatableMap<T> = {
  [K in keyof T as T[K] extends InputSignal<any>
    ? K
    : never]: T[K] extends InputSignal<infer Value> ? Value : never
}

/**
 * Set required signal input value to component fixture
 * @see https://github.com/angular/angular/issues/54013
 */
export function setSignalInputs<T extends NonNullable<unknown>>(
  component: T,
  inputs: ToSignalInputUpdatableMap<T>,
) {
  for (const inputKey in inputs) {
    if (componentHasSignalInputProperty(component, inputKey)) {
      signalSetFn(component[inputKey][SIGNAL], inputs[inputKey])
    }
  }
}

export function setFixtureSignalInputs<T extends NonNullable<unknown>>(
  componentFixture: ComponentFixture<T>,
  inputs: ToSignalInputUpdatableMap<T>,
  options: { detectChanges: boolean } = { detectChanges: true },
) {
  setSignalInputs(componentFixture.componentInstance, inputs)
  if (options.detectChanges) {
    componentFixture.detectChanges()
  }
}

export function setFixtureSignalInput<
  T extends NonNullable<unknown>,
  InputMaps extends ToSignalInputUpdatableMap<T>,
  InputName extends keyof InputMaps,
>(
  componentFixture: ComponentFixture<T>,
  inputName: InputName,
  value: InputMaps[InputName],
) {
  setSignalInputs(componentFixture.componentInstance, {
    [inputName]: value,
  } as ToSignalInputUpdatableMap<T>)
}

function componentHasSignalInputProperty<TProperty extends string>(
  component: object,
  property: TProperty,
): component is { [key in TProperty]: InputSignal<unknown> } {
  return (
    component.hasOwnProperty(property) && (component as any)[property][SIGNAL]
  )
}

export async function flushQueue() {
  await new Promise(setImmediate)
}

export const experimentalReactivity_testShouldBeComputedProperty = (
  testObj: any,
  propertyName: string,
) => {
  if (propertyName.startsWith('_rootNotifier')) {
    return true
  }
  if (propertyName.endsWith('Handler')) {
    return false
  }

  if (propertyName.startsWith('get')) {
    // Only properties with no arguments are computed
    const fn = testObj[propertyName]
    // Cannot test if is lazy computed since we return the unwrapped value
    return fn instanceof Function && fn.length === 0
  }

  return false
}

export const testShouldBeComputedProperty = (
  testObj: any,
  propertyName: string,
) => {
  if (propertyName.endsWith('Handler') || propertyName.endsWith('Model')) {
    return false
  }

  if (propertyName.startsWith('get')) {
    // Only properties with no arguments are computed
    const fn = testObj[propertyName]
    // Cannot test if is lazy computed since we return the unwrapped value
    return fn instanceof Function && fn.length === 0
  }

  return false
}
