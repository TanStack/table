import {
  Component,
  input,
  signal,
  ViewChild,
  type TemplateRef,
} from '@angular/core'
import { TestBed, type ComponentFixture } from '@angular/core/testing'
import { createColumnHelper } from '@tanstack/table-core'
import { describe, expect, test } from 'vitest'
import {
  FlexRender,
  flexRenderComponent,
  FlexRenderDirective,
  injectFlexRenderContext,
} from '../../src'
import { setFixtureSignalInput, setFixtureSignalInputs } from '../test-utils'

interface Data {
  id: string
  title: string
  description: string
  status: 'success' | 'failed' | 'pending'
  favorite?: boolean
}

describe('FlexRenderDirective', () => {
  const helper = createColumnHelper<{}, Data>()

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

  // Skip for now, test framework (using ComponentRef.setInput) cannot recognize signal inputs
  // as component inputs
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
