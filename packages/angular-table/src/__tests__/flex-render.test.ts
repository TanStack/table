import { describe, expect, test } from 'vitest'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  input,
  type OnInit,
  type TemplateRef,
  ViewChild,
} from '@angular/core'
import { createColumnHelper } from '@tanstack/table-core'
import {
  FlexRenderComponent,
  FlexRenderDirective,
  injectFlexRenderContext,
} from '../flex-render'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { setFixtureSignalInput, setFixtureSignalInputs } from './test-utils'

interface Data {
  id: string
  title: string
  description: string
  status: 'success' | 'failed' | 'pending'
  favorite?: boolean
}

describe('FlexRenderDirective', () => {
  const helper = createColumnHelper<Data>()

  test('should render primitives', async () => {
    const fixture = TestBed.createComponent(TestRenderComponent)

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

    // Null
    setFixtureSignalInputs(fixture, {
      content: () => null,
      context: {},
    })
    expectPrimitiveValueIs(fixture, '')

    // Undefined
    setFixtureSignalInputs(fixture, {
      content: () => undefined,
      context: {},
    })
    expectPrimitiveValueIs(fixture, '')
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
    setFixtureSignalInputs(fixture, {
      content: () => new FlexRenderComponent(FakeComponent),
      context: {
        property: 'Context value',
      },
    })

    expect(fixture.nativeElement.textContent).toEqual('Context value')

    setFixtureSignalInput(fixture, 'context', { property: 'Updated value' })
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
  imports: [FlexRenderDirective],
})
class TestRenderComponent {
  readonly content = input.required<FlexRenderDirectiveAllowedContent>()

  readonly context = input.required<Record<string, unknown>>()
}

type FlexRenderDirectiveAllowedContent = FlexRenderDirective<
  NonNullable<unknown>
>['content']

function expectPrimitiveValueIs(
  fixture: ComponentFixture<unknown>,
  value: unknown
) {
  const span = fixture.nativeElement.querySelector('span')
  expect(span).toBeDefined()
  expect(span.innerHTML).toEqual(value)
}
