import { Component, ViewChild, input, output, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { describe, expect, test, vi } from 'vitest'
import {
  FlexRender,
  FlexRenderDirective,
  flexRenderComponent,
  injectFlexRenderContext,
} from '../../src'
import { setFixtureSignalInput, setFixtureSignalInputs } from '../test-utils'
import type { ComponentFixture } from '@angular/core/testing'
import type { TemplateRef } from '@angular/core'

describe('FlexRenderDirective', () => {
  test('should render primitives', () => {
    const fixture = TestBed.createComponent(TestRenderComponent)

    // Null
    setFixtureSignalInputs(fixture, {
      content: () => null,
      context: {},
    })
    expect((fixture.nativeElement as HTMLElement).matches(':empty')).toBe(true)

    // Undefined
    setFixtureSignalInputs(fixture, {
      content: () => undefined,
      context: {},
    })
    expect((fixture.nativeElement as HTMLElement).matches(':empty')).toBe(true)

    // String
    setFixtureSignalInputs(fixture, {
      content: 'My value',
      context: {},
    })
    expectPrimitiveValueIs(fixture, 'My value')

    // Numbers
    setFixtureSignalInputs(fixture, {
      content: 0,
      context: {},
    })
    expectPrimitiveValueIs(fixture, '0')

    // Functions that returns primitives
    setFixtureSignalInputs(fixture, {
      content: () => 'My value 2',
      context: {},
    })
    expectPrimitiveValueIs(fixture, 'My value 2')

    // Set again to null to be sure content has been destroyed
    setFixtureSignalInputs(fixture, {
      content: () => null,
      context: {},
    })
    expect((fixture.nativeElement as HTMLElement).matches(':empty')).toBe(true)
  })

  test('should evaluate and update primitive content only when its dependencies change', () => {
    const value = signal('Initial value')
    const render = vi.fn(() => value())
    const fixture = TestBed.createComponent(TestRenderComponent)

    setFixtureSignalInputs(fixture, {
      content: render,
      context: {},
    })

    const initialSpan = fixture.nativeElement.querySelector('span')
    expect(render).toHaveBeenCalledTimes(1)
    expect(initialSpan.textContent).toEqual('Initial value')

    fixture.detectChanges()
    fixture.detectChanges()

    expect(render).toHaveBeenCalledTimes(1)
    expect(fixture.nativeElement.querySelector('span')).toBe(initialSpan)

    value.set('Updated value')
    fixture.detectChanges()

    expect(render).toHaveBeenCalledTimes(2)
    expect(fixture.nativeElement.querySelector('span')).toBe(initialSpan)
    expect(initialSpan.textContent).toEqual('Updated value')
  })

  test('should memoize resolved content across input and internal signal updates', () => {
    const value = signal('first')
    const render = vi.fn(
      (context: Record<string, unknown>) => `${context['label']}:${value()}`,
    )
    const fixture = TestBed.createComponent(TestRenderComponent)

    setFixtureSignalInputs(fixture, {
      content: render,
      context: { label: 'initial' },
    })

    expect(render).toHaveBeenCalledTimes(1)
    expect(fixture.nativeElement.textContent).toEqual('initial:first')

    setFixtureSignalInput(fixture, 'context', { label: 'updated' })
    fixture.detectChanges()

    expect(render).toHaveBeenCalledTimes(2)
    expect(fixture.nativeElement.textContent).toEqual('updated:first')

    value.set('second')
    fixture.detectChanges()

    expect(render).toHaveBeenCalledTimes(3)
    expect(fixture.nativeElement.textContent).toEqual('updated:second')
  })

  test('should replace render-function effects when the content input changes', () => {
    const firstValue = signal('first')
    const secondValue = signal('second')
    const firstRender = vi.fn(() => firstValue())
    const secondRender = vi.fn(() => secondValue())
    const fixture = TestBed.createComponent(TestRenderComponent)

    setFixtureSignalInputs(fixture, {
      content: firstRender,
      context: {},
    })

    expect(firstRender).toHaveBeenCalledTimes(1)
    expect(fixture.nativeElement.textContent).toEqual('first')

    setFixtureSignalInput(fixture, 'content', secondRender)
    fixture.detectChanges()

    expect(secondRender).toHaveBeenCalledTimes(1)
    expect(fixture.nativeElement.textContent).toEqual('second')

    firstValue.set('stale first')
    fixture.detectChanges()

    expect(firstRender).toHaveBeenCalledTimes(1)
    expect(fixture.nativeElement.textContent).toEqual('second')

    setFixtureSignalInput(fixture, 'content', 'static')
    fixture.detectChanges()
    secondValue.set('stale second')
    fixture.detectChanges()

    expect(secondRender).toHaveBeenCalledTimes(1)
    expect(fixture.nativeElement.textContent).toEqual('static')

    setFixtureSignalInput(fixture, 'content', firstRender)
    fixture.detectChanges()
    firstValue.set('live first')
    fixture.detectChanges()

    expect(firstRender).toHaveBeenCalledTimes(3)
    expect(fixture.nativeElement.textContent).toEqual('live first')
  })

  test('should react when a render function changes from null to content', () => {
    const visible = signal(false)
    const fixture = TestBed.createComponent(TestRenderComponent)

    setFixtureSignalInputs(fixture, {
      content: () => (visible() ? 'Visible' : null),
      context: {},
    })

    expect((fixture.nativeElement as HTMLElement).matches(':empty')).toBe(true)

    visible.set(true)
    fixture.detectChanges()

    expectPrimitiveValueIs(fixture, 'Visible')
  })

  test('should render TemplateRef', () => {
    @Component({
      template: `
        <ng-template #template let-context>{{ context.property }}</ng-template>
      `,
      standalone: true,
    })
    class FakeTemplateRefComponent {
      @ViewChild('template', { static: true })
      templateRef!: TemplateRef<any>
    }

    const templateRef = TestBed.createComponent(FakeTemplateRefComponent)
      .componentInstance.templateRef

    const fixture = TestBed.createComponent(TestRenderComponent)
    setFixtureSignalInputs(fixture, {
      content: () => templateRef,
      context: {
        property: 'Property context value',
      },
    })

    expect(fixture.nativeElement.textContent).toEqual('Property context value')

    setFixtureSignalInput(fixture, 'context', { property: 'Updated value' })
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).toEqual('Updated value')
  })

  test('should render components', () => {
    @Component({
      template: `{{ context.property }}`,
      standalone: true,
    })
    class FakeComponent {
      context = injectFlexRenderContext<{ property: string }>()
    }

    const fixture = TestBed.createComponent(TestRenderComponent)
    setFixtureSignalInputs(
      fixture,
      {
        content: () => flexRenderComponent(FakeComponent),
        context: {
          property: 'Context value',
        },
      },
      { detectChanges: true },
    )

    expect(fixture.nativeElement.textContent).toEqual('Context value')

    setFixtureSignalInput(fixture, 'context', { property: 'Updated value' })
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).toEqual('Updated value')
  })

  test('should release and restore component output subscriptions', () => {
    @Component({
      template: `<button (click)="changed.emit()">Emit</button>`,
      standalone: true,
    })
    class FakeComponent {
      readonly changed = output<void>()
    }

    const enabled = signal(true)
    const listener = vi.fn()
    const fixture = TestBed.createComponent(TestRenderComponent)

    setFixtureSignalInputs(fixture, {
      content: () =>
        flexRenderComponent(FakeComponent, {
          outputs: enabled() ? { changed: listener } : {},
        }),
      context: {},
    })

    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement
    button.click()
    expect(listener).toHaveBeenCalledTimes(1)

    enabled.set(false)
    fixture.detectChanges()
    button.click()
    expect(listener).toHaveBeenCalledTimes(1)

    enabled.set(true)
    fixture.detectChanges()
    button.click()
    expect(listener).toHaveBeenCalledTimes(2)
    expect(fixture.nativeElement.querySelector('button')).toBe(button)
  })

  test('should set component inputs by property name when they have an alias', () => {
    @Component({
      template: `{{ value() }}`,
      standalone: true,
    })
    class FakeComponent {
      readonly value = input('', { alias: 'aliasedValue' })
    }

    const fixture = TestBed.createComponent(TestRenderComponent)
    setFixtureSignalInputs(fixture, {
      content: () =>
        flexRenderComponent(FakeComponent, {
          inputs: { value: 'Aliased input value' },
        }),
      context: {},
    })

    expect(fixture.nativeElement.textContent).toEqual('Aliased input value')
  })

  test('should subscribe to aliased outputs by property name', () => {
    @Component({
      template: `<button (click)="changed.emit()">Emit</button>`,
      standalone: true,
    })
    class FakeComponent {
      readonly changed = output<void>({ alias: 'aliasedChanged' })
    }

    const listener = vi.fn()
    const fixture = TestBed.createComponent(TestRenderComponent)
    setFixtureSignalInputs(fixture, {
      content: () =>
        flexRenderComponent(FakeComponent, {
          outputs: { changed: listener },
        }),
      context: {},
    })

    fixture.nativeElement.querySelector('button').click()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('should preserve omitted inputs and forward explicit undefined', () => {
    @Component({
      selector: 'app-patched-input-component',
      template: `{{ value() === undefined ? 'undefined' : value() }}`,
      standalone: true,
    })
    class FakeComponent {
      readonly value = input<string | undefined>('initial')
    }

    const mode = signal<'set' | 'omit' | 'clear'>('set')
    const fixture = TestBed.createComponent(TestRenderComponent)
    setFixtureSignalInputs(fixture, {
      content: () => {
        const currentMode = mode()
        const inputs: { value?: string | undefined } =
          currentMode === 'set'
            ? { value: 'updated' }
            : currentMode === 'clear'
              ? { value: undefined }
              : {}
        return flexRenderComponent(FakeComponent, { inputs })
      },
      context: {},
    })

    const initialHost = fixture.nativeElement.querySelector(
      'app-patched-input-component',
    )
    expect(initialHost.textContent).toEqual('updated')

    mode.set('omit')
    fixture.detectChanges()

    expect(
      fixture.nativeElement.querySelector('app-patched-input-component'),
    ).toBe(initialHost)
    expect(initialHost.textContent).toEqual('updated')

    mode.set('clear')
    fixture.detectChanges()

    expect(initialHost.textContent).toEqual('undefined')
  })

  test('should reuse a component by type and key and recreate it when the key changes', () => {
    @Component({
      selector: 'app-keyed-component',
      template: `{{ value() }}`,
      standalone: true,
    })
    class KeyedComponent {
      readonly value = input.required<string>()
    }

    const key = signal<string | number>('first')
    const value = signal('Initial value')
    const fixture = TestBed.createComponent(TestRenderComponent)

    setFixtureSignalInputs(fixture, {
      content: () =>
        flexRenderComponent(KeyedComponent, {
          key: key(),
          inputs: { value: value() },
          // These creation-time arrays are intentionally recreated whenever
          // the render function runs. They do not affect reuse without a new key.
          bindings: [],
          directives: [],
        }),
      context: {},
    })

    const initialHost = fixture.nativeElement.querySelector(
      'app-keyed-component',
    )
    expect(initialHost.textContent).toEqual('Initial value')

    value.set('Updated value')
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('app-keyed-component')).toBe(
      initialHost,
    )
    expect(initialHost.textContent).toEqual('Updated value')

    key.set(2)
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('app-keyed-component')).not.toBe(
      initialHost,
    )
    expect(fixture.nativeElement.textContent).toEqual('Updated value')
  })

  test('should recreate content when the content function reference changes', () => {
    @Component({
      selector: 'app-reusable-component',
      template: `{{ value() }}`,
      standalone: true,
    })
    class ReusableComponent {
      readonly value = input.required<string>()
    }

    const firstRender = vi.fn(() =>
      flexRenderComponent(ReusableComponent, {
        key: 'stable',
        inputs: { value: 'first' },
      }),
    )
    const secondRender = vi.fn(() =>
      flexRenderComponent(ReusableComponent, {
        key: 'stable',
        inputs: { value: 'second' },
      }),
    )
    const fixture = TestBed.createComponent(TestRenderComponent)

    setFixtureSignalInputs(fixture, {
      content: firstRender,
      context: {},
    })

    const initialHost = fixture.nativeElement.querySelector(
      'app-reusable-component',
    )
    expect(firstRender).toHaveBeenCalledTimes(1)
    expect(initialHost.textContent).toEqual('first')

    setFixtureSignalInput(fixture, 'content', secondRender)
    fixture.detectChanges()

    expect(secondRender).toHaveBeenCalledTimes(1)
    expect(
      fixture.nativeElement.querySelector('app-reusable-component'),
    ).not.toBe(initialHost)
    expect(fixture.nativeElement.textContent).toEqual('second')
  })

  test('should rerender when content has conditional return with different component types', () => {
    @Component({
      selector: 'app-fake-a',
      template: `A component`,
      standalone: true,
    })
    class FakeComponentA {
      context = injectFlexRenderContext<{ property: string }>()
    }

    @Component({
      selector: 'app-fake-b',
      template: `B component`,
      standalone: true,
    })
    class FakeComponentB {}

    const fixture = TestBed.createComponent(TestRenderComponent)
    const showB = signal(false)

    setFixtureSignalInputs(fixture, {
      content: () => {
        return showB()
          ? flexRenderComponent(FakeComponentB)
          : flexRenderComponent(FakeComponentA)
      },
      context: {},
    })

    expect(fixture.nativeElement.textContent).toEqual('A component')

    showB.set(true)

    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).toEqual('B component')
  })

  test('should render custom components', async () => {
    @Component({
      template: `{{ row().property }}`,
      standalone: true,
    })
    class FakeComponent {
      row = input.required<{ property: string }>()

      constructor() {}
    }

    const fixture = TestBed.createComponent(TestRenderComponent)
    setFixtureSignalInputs(fixture, {
      content: () => FakeComponent,
      context: {
        row: {
          property: 'Row value',
        },
      },
    })

    expect(fixture.nativeElement.textContent).toEqual('Row value')

    setFixtureSignalInput(fixture, 'context', {
      row: { property: 'Updated value' },
    })
    await fixture.whenRenderingDone()
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).toEqual('Updated value')
  })

  test('should ignore context properties that are not component inputs', () => {
    @Component({
      template: `{{ row() }}`,
      standalone: true,
    })
    class FakeComponent {
      readonly row = input.required<string>()
    }

    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    try {
      const fixture = TestBed.createComponent(TestRenderComponent)
      setFixtureSignalInputs(fixture, {
        content: () => FakeComponent,
        context: {
          row: 'Known input',
          unknownContextProperty: 'Ignored value',
        },
      })

      expect(fixture.nativeElement.textContent).toEqual('Known input')
      expect(consoleError).not.toHaveBeenCalled()
    } finally {
      consoleError.mockRestore()
    }
  })
})

@Component({
  selector: 'app-test-render',
  template: `
    <ng-container *flexRender="content(); props: context(); let renderValue">
      <span [innerHTML]="renderValue"></span>
    </ng-container>
  `,
  standalone: true,
  imports: [FlexRender],
})
class TestRenderComponent {
  readonly content = input.required<FlexRenderAllowedContent>()

  readonly context = input.required<Record<string, unknown>>()
}

type FlexRenderAllowedContent = ReturnType<
  FlexRenderDirective<
    any,
    any,
    NonNullable<unknown>,
    NonNullable<unknown>
  >['content']
>

function expectPrimitiveValueIs(
  fixture: ComponentFixture<unknown>,
  value: unknown,
) {
  expect(fixture.nativeElement.matches(':empty')).toBe(false)
  const span = fixture.nativeElement.querySelector('span')
  expect(span).toBeDefined()
  expect(span.innerHTML).toEqual(value)
}
