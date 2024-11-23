import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  InjectionToken,
  Injector,
  Input,
  TemplateRef,
  Type,
  ViewContainerRef,
  effect,
  inject,
  isSignal,
} from '@angular/core'
import type { EffectRef, OnChanges, SimpleChanges } from '@angular/core'
import type { Table } from '@tanstack/table-core'

export type FlexRenderContent<TProps extends NonNullable<unknown>> =
  | string
  | number
  | Type<TProps>
  | FlexRenderComponent<TProps>
  | TemplateRef<{ $implicit: TProps }>
  | null
  | undefined

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective<TProps extends NonNullable<unknown>>
  implements OnChanges
{
  @Input({ required: true, alias: 'flexRender' })
  content:
    | number
    | string
    | ((props: TProps) => FlexRenderContent<TProps>)
    | null
    | undefined = undefined

  @Input({ required: true, alias: 'flexRenderProps' })
  props: TProps = {} as TProps

  @Input({ required: false, alias: 'flexRenderInjector' })
  injector: Injector = inject(Injector)

  constructor(
    @Inject(ViewContainerRef)
    private readonly viewContainerRef: ViewContainerRef,
    @Inject(TemplateRef)
    private readonly templateRef: TemplateRef<any>,
  ) {}

  ref?: ComponentRef<unknown> | EmbeddedViewRef<unknown> | null = null

  effect?: EffectRef

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['content']) {
      return
    }
    this.render()
  }

  render() {
    this.viewContainerRef.clear()
    const { content, props } = this
    if (content === null || content === undefined) {
      this.ref = null
    }
    if (typeof content === 'function') {
      this.ref = this.renderContent(content(props))
    } else {
      this.ref = this.renderContent(content)
    }

    if (this.effect) {
      this.effect.destroy()
    }
    // TODO: wip, must improve this. All cell/rows/header should a have their own notifier listener
    this.effect = effect(
      () => {
        const props = this.props
        if (this.ref instanceof ComponentRef) {
          this.ref.injector.get(ChangeDetectorRef).markForCheck()
        }
        if ('table' in props) {
          const table = props.table as Table<any, any>
          table._signalNotifier()
        }
      },
      { injector: this.injector },
    )
  }

  private renderContent(content: FlexRenderContent<TProps>) {
    if (typeof content === 'string' || typeof content === 'number') {
      return this.renderStringContent()
    }
    if (content instanceof TemplateRef) {
      return this.viewContainerRef.createEmbeddedView(
        content,
        this.getTemplateRefContext(),
      )
    } else if (content instanceof FlexRenderComponent) {
      return this.renderComponent(content)
    } else if (content instanceof Type) {
      return this.renderCustomComponent(content)
    } else {
      return null
    }
  }

  private renderStringContent(): EmbeddedViewRef<unknown> {
    const context = () => {
      return typeof this.content === 'string' ||
        typeof this.content === 'number'
        ? this.content
        : this.content?.(this.props)
    }
    return this.viewContainerRef.createEmbeddedView(this.templateRef, {
      get $implicit() {
        return context()
      },
    })
  }

  private renderComponent(
    flexRenderComponent: FlexRenderComponent<TProps>,
  ): ComponentRef<unknown> {
    const { component, inputs, injector } = flexRenderComponent

    const getContext = () => this.props

    const proxy = new Proxy(this.props, {
      get: (_, key) => getContext()[key as keyof typeof _],
    })

    const componentInjector = Injector.create({
      parent: injector ?? this.injector,
      providers: [{ provide: FlexRenderComponentProps, useValue: proxy }],
    })

    const componentRef = this.viewContainerRef.createComponent(component, {
      injector: componentInjector,
    })
    for (const prop in inputs) {
      if (componentRef.instance?.hasOwnProperty(prop)) {
        componentRef.setInput(prop, inputs[prop])
      }
    }
    return componentRef
  }

  private renderCustomComponent(
    component: Type<unknown>,
  ): ComponentRef<unknown> {
    const componentRef = this.viewContainerRef.createComponent(component, {
      injector: this.injector,
    })
    for (const prop in this.props) {
      // Only signal based input can be added here
      if (
        componentRef.instance?.hasOwnProperty(prop) &&
        // @ts-ignore - unknown error
        isSignal(componentRef.instance[prop])
      ) {
        componentRef.setInput(prop, this.props[prop])
      }
    }
    return componentRef
  }

  private getTemplateRefContext() {
    const getContext = () => this.props
    return {
      get $implicit() {
        return getContext()
      },
    }
  }
}

export class FlexRenderComponent<T extends NonNullable<unknown>> {
  constructor(
    readonly component: Type<unknown>,
    readonly inputs: T = {} as T,
    readonly injector?: Injector,
  ) {}
}

const FlexRenderComponentProps = new InjectionToken<NonNullable<unknown>>(
  '[@tanstack/angular-table] Flex render component context props',
)

export function injectFlexRenderContext<T extends NonNullable<unknown>>(): T {
  return inject<T>(FlexRenderComponentProps)
}
