import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective implements OnInit {
  private _flexRender: any

  /** properties to render */
  private _flexRenderProps: any

  @Input()
  set flexRender(render: any) {
    this._flexRender = render
  }

  @Input()
  set flexRenderProps(props: any) {
    this._flexRenderProps = props
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    this.renderComponent()
  }

  renderComponent() {
    this.viewContainer.clear()
    if (!this._flexRender) {
      return ''
    }

    if (typeof this._flexRender === 'string') {
      return this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: this._flexRender,
      })
    }

    if (typeof this._flexRender === 'function') {
      const componentInstance = this._flexRender(this._flexRenderProps)
      return this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: componentInstance,
      })
    }

    return ''
  }
}
