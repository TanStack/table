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

export async function flushQueue() {
  await new Promise(setImmediate)
}
