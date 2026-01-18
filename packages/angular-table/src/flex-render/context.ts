import { InjectionToken, inject } from '@angular/core'

export const FlexRenderComponentProps = new InjectionToken<
  NonNullable<unknown>
>('[@tanstack/angular-table] Flex render component context props')

/**
 * Inject the flex render context props.
 *
 * Can be used in components rendered via FlexRender directives.
 */
export function injectFlexRenderContext<T extends NonNullable<unknown>>(): T {
  return inject<T>(FlexRenderComponentProps)
}
