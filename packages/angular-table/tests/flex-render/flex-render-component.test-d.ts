import { input } from '@angular/core'
import { test } from 'vitest'
import { flexRenderComponent } from '../../src'

test('Infer component inputs', () => {
  class Test {
    readonly input1 = input<string>()
  }

  // @ts-expect-error Must pass right type as a value
  flexRenderComponent(Test, { inputs: { input1: 1 } })

  // Input is optional so we can skip passing the property
  flexRenderComponent(Test, { inputs: {} })
})
