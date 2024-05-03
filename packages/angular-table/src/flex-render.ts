import {
  Directive,
  inject,
  InjectionToken,
  Injector,
  Input,
  type OnInit,
  TemplateRef,
  type Type,
  ViewContainerRef,
} from '@angular/core'

type FlexRenderContent<TProps extends NonNullable<unknown>> =
  | string
  | FlexRenderComponent<TProps>
  | TemplateRef<{ $implicit: TProps }>

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective<TProps extends NonNullable<unknown>>
  implements OnInit
{
  @Input({ required: true, alias: 'flexRender' })
  content: string | ((props: TProps) => FlexRenderContent<TProps>) | undefined =
    undefined

  @Input({ required: true, alias: 'flexRenderProps' })
  props: TProps = {} as TProps

  @Input({ required: false, alias: 'flexRenderInjector' })
  injector: Injector = inject(Injector)

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    this.render()
  }

  render() {
    this.viewContainerRef.clear()
    const { content, props } = this
    if (!this.content) {
      return null
    }

    if (typeof content === 'string') {
      return this.viewContainerRef.createEmbeddedView(this.templateRef, {
        get $implicit() {
          return content
        },
      })
    }
    if (typeof content === 'function') {
      return this.renderContent(content(props));
    }
  }

  private renderContent(content: FlexRenderContent<TProps>) {
    if (typeof content === 'string') {
      return this.viewContainerRef.createEmbeddedView(this.templateRef, {
        get $implicit() {
          return content
        },
      })
    }
    if (content instanceof TemplateRef) {
      const props = () => this.props
      return this.viewContainerRef.createEmbeddedView(content, {
        get $implicit() {
          return props()
        },
      })
    }
    return this.renderComponent(content)
  }

  private renderComponent(flexRenderComponent: FlexRenderComponent<TProps>) {
    const { component, props } = flexRenderComponent
    const componentRef = this.viewContainerRef.createComponent(component, {
      injector: this.injector,
    })
    for (const prop in props) {
      if (componentRef.instance?.hasOwnProperty(prop)) {
        componentRef.setInput(prop, props[prop])
      }
    }
  }
}

export class FlexRenderComponent<T extends NonNullable<unknown>> {
  constructor(
    readonly component: Type<unknown>,
    readonly props: T
  ) {}
}
