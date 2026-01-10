import { SIGNAL } from '@angular/core/primitives/signals'
import { getMemoFnMeta } from '@tanstack/table-core'
import type { InputSignal } from '@angular/core'
import type { ComponentFixture } from '@angular/core/testing'

type ToSignalInputUpdatableMap<T> = {
  [K in keyof T as T[K] extends InputSignal<any>
    ? K
    : never]?: T[K] extends infer Input
    ? Input extends InputSignal<infer T>
      ? T
      : never
    : never
}

export function setFixtureSignalInputs<T extends NonNullable<unknown>>(
  componentFixture: ComponentFixture<T>,
  inputs: ToSignalInputUpdatableMap<T>,
  options: { detectChanges: boolean } = { detectChanges: true },
) {
  for (const inputKey in inputs) {
    componentFixture.componentRef.setInput(inputKey, inputs[inputKey])
  }
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
  setFixtureSignalInputs(componentFixture, {
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

const staticComputedProperties = ['get', 'state']
const staticNonComputedProperties = [
  'getIsSomeRowsPinned',
  'getColumn',
  'getRowId',
  'getRow',
  'getIsSomeColumnsPinned',
  'getContext',
]

function getFnArgsLength(
  fn: ((...args: any) => any) & { originalArgsLength?: number },
): number {
  return Math.max(0, getMemoFnMeta(fn)?.originalArgsLength ?? fn.length)
}

export const testShouldBeComputedProperty = (
  testObj: any,
  propertyName: string,
  excludeComputed: Array<string> = [],
) => {
  if (excludeComputed.includes(propertyName)) {
    return false
  }

  if (staticNonComputedProperties.some((prop) => propertyName === prop)) {
    return false
  }

  if (staticComputedProperties.some((prop) => propertyName === prop)) {
    return true
  }
  if (propertyName.endsWith('Handler')) {
    return false
  }
  if (propertyName.startsWith('get')) {
    // Only properties with no arguments are computed
    const fn = testObj[propertyName]
    // Cannot test if is lazy computed since we return the unwrapped value
    const args = Math.max(0, getFnArgsLength(fn) - 1)
    return fn instanceof Function && args === 0
  }
  return false
}

export function getFnReactiveCache(fn: any): any {
  return fn._reactiveCache
}
