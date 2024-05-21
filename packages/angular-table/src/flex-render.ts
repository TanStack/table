import {
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core'

type FlexRenderContent<TProps extends NonNullable<unknown>> =
  | string
  | number
  | Type<TProps>
  | TemplateRef<{ $implicit: TProps }>
  | null

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective<TProps extends NonNullable<unknown>> {
  // set the type to unknown as input signal is not able to recognize the types correctly
  // which causes build error
  content = input.required<unknown>({ alias: 'flexRender' })

  props = input<TProps>({} as TProps, { alias: 'flexRenderProps' })

  private readonly injector = inject(Injector)
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly templateRef = inject(TemplateRef<any>)

  ngOnInit(): void {
    this.render()
  }

  render() {
    this.viewContainerRef.clear()
    const content = this.content()
    if (!content) {
      return null
    }

    if (typeof content === 'function') {
      return this.renderContent(content(this.props()))
    }
    return this.renderStringContent(content as FlexRenderContent<TProps>)
  }

  private renderContent(content: FlexRenderContent<TProps>) {
    if (content instanceof TemplateRef) {
      return this.viewContainerRef.createEmbeddedView(
        content,
        this.getTemplateRefContext()
      )
    } else if (content instanceof Type) {
      return this.renderComponent(content)
    } else if (content) {
      return this.renderStringContent(content)
    } else {
      return null
    }
  }

  private renderStringContent(
    content: FlexRenderContent<TProps>
  ): EmbeddedViewRef<unknown> {
    const context = () => content
    return this.viewContainerRef.createEmbeddedView(this.templateRef, {
      get $implicit() {
        return context()
      },
    })
  }

  private renderComponent(component: Type<unknown>): ComponentRef<unknown> {
    const componentRef = this.viewContainerRef.createComponent(component, {
      injector: this.injector,
    })
    const props = this.props()
    for (const prop in props) {
      // Only signal based input can be added here
      if (componentRef.instance?.hasOwnProperty(prop)) {
        componentRef.setInput(prop, props[prop])
      }
    }
    return componentRef
  }

  private getTemplateRefContext() {
    const getContext = () => this.props()
    return {
      get $implicit() {
        return getContext()
      },
    }
  }
}
