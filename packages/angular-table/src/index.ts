import { FlexRenderCell } from './helpers/flexRenderCell'
import { FlexRenderDirective } from './flexRender'

export * from '@tanstack/table-core'

export * from './angularReactivityFeature'
export * from './flexRender'
export * from './injectTable'
export * from './flex-render/flexRenderComponent'

export * from './helpers/cell'
export * from './helpers/header'
export * from './helpers/table'
export * from './helpers/createTableHook'
export * from './helpers/flexRenderCell'

/**
 * Constant helper to import FlexRender directives.
 * 
 * You should prefer to use this constant over importing the directives separately,
 * as it ensures you always have the correct set of directives over library updates.
 * 
 * @see {@link FlexRenderDirective} and {@link FlexRenderCell} for more details on the directives included in this export.
 */
export const FlexRender = [FlexRenderDirective, FlexRenderCell] as const
