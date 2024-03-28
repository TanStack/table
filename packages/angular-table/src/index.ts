import {
  computed,
  Directive,
  effect,
  inject,
  Injector,
  Input,
  OnInit,
  runInInjectionContext,
  signal,
  TemplateRef,
  untracked,
  ViewContainerRef,
} from '@angular/core'
import {
  createTable,
  RowData,
  TableOptions,
  TableOptionsResolved,
} from '@tanstack/table-core'
import { proxifyTable, type TableResult } from './proxy'

export * from '@tanstack/table-core'

@Directive({
  selector: '[flexRender]',
  standalone: true,
})
export class FlexRenderDirective implements OnInit {
  private _flexRender: any

  /** properties to render */
  private _flexRenderProps: any

  @Input({ required: true })
  set flexRender(render: any) {
    this._flexRender = render
  }

  @Input({ required: true })
  set flexRenderProps(props: any) {
    this._flexRenderProps = props
  }

  constructor(
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    // This ensures that if the 'flexRender' input is set before the directive initializes,
    // the component will be rendered when ngOnInit is called.
    if (this._flexRender) {
      this.renderComponent()
    }
  }

  renderComponent() {
    this.vcr.clear()
    if (!this._flexRender) {
      return null
    }
    if (typeof this._flexRender === 'string') {
      return this.vcr.createEmbeddedView(this.templateRef, {
        $implicit: this._flexRender,
      })
    } else if (typeof this._flexRender === 'function') {
      const componentInstance = this._flexRender(this._flexRenderProps)
      return this.vcr.createEmbeddedView(this.templateRef, {
        $implicit: componentInstance,
      })
    }
    return null
  }
}

export function createAngularTable<TData extends RowData>(
  options: () => TableOptions<TData>
): TableResult<TData> {
  const injector = inject(Injector)
  return runInInjectionContext(injector, () => {
    const resolvedOptionsSignal = computed<TableOptionsResolved<TData>>(() => {
      return {
        state: {},
        onStateChange: () => {},
        renderFallbackValue: null,
        ...options(),
      }
    })

    const table = signal(createTable(untracked(resolvedOptionsSignal)), {
      equal: () => false,
    })
    const state = signal(untracked(table).initialState)

    function updateOptions() {
      const tableState = state()
      const resolvedOptions = resolvedOptionsSignal()
      untracked(() => {
        table().setOptions(prev => ({
          ...prev,
          ...resolvedOptions,
          state: { ...tableState, ...resolvedOptions.state },
          onStateChange: updater => {
            const value =
              updater instanceof Function ? updater(tableState) : updater
            state.set(value)
            resolvedOptions.onStateChange?.(updater)
          },
        }))
      })
    }

    updateOptions()

    effect(() => {
      void [state(), resolvedOptionsSignal()]
      untracked(() => {
        updateOptions()
        table.update(value => ({ ...value }))
      })
    })

    return proxifyTable(table.asReadonly())
  })
}
