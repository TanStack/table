import { defineComponent, h, isVNode } from 'vue'
import type { PropType } from 'vue'

export interface FlexRenderCell {
  column: {
    columnDef: {
      aggregatedCell?: any
      cell?: any
    }
  }
  getContext: () => any
  getIsAggregated?: () => boolean
  getIsPlaceholder?: () => boolean
}

export interface FlexRenderHeader {
  column: {
    columnDef: {
      footer?: any
      header?: any
    }
  }
  getContext: () => any
}

/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
 * @example flexRender(cell.column.columnDef.cell, cell.getContext())
 */
export function flexRender(render: any, props: any): any {
  if (typeof render === 'function') {
    const rendered = render(props)

    if (isVNode(rendered)) {
      return rendered
    }

    if (typeof rendered === 'function' || typeof rendered === 'object') {
      return h(rendered, props)
    }

    return rendered
  }

  if (typeof render === 'object') {
    return h(render, props)
  }

  return render
}

/**
 * Simplified component for rendering headers, cells, or footers.
 *
 * Supports both the new shorthand pattern and the legacy `:render`/`:props` pattern:
 * @example
 * ```vue
 * <!-- New shorthand pattern -->
 * <FlexRender :cell="cell" />
 * <FlexRender :header="header" />
 * <FlexRender :footer="header" />
 *
 * <!-- Legacy pattern (still supported) -->
 * <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
 * ```
 */
export const FlexRender = defineComponent({
  props: {
    render: {
      type: [Function, Object, String] as PropType<any>,
      default: undefined,
    },
    props: {
      type: Object as PropType<any>,
      default: undefined,
    },
    cell: {
      type: Object as PropType<FlexRenderCell>,
      default: undefined,
    },
    header: {
      type: Object as PropType<FlexRenderHeader>,
      default: undefined,
    },
    footer: {
      type: Object as PropType<FlexRenderHeader>,
      default: undefined,
    },
  },
  setup: (props: {
    render?: any
    props?: any
    cell?: FlexRenderCell
    header?: FlexRenderHeader
    footer?: FlexRenderHeader
  }) => {
    return () => {
      // New shorthand pattern: extract render and props from cell/header/footer
      if (props.cell) {
        const cell = props.cell
        const def = cell.column.columnDef
        // When the column-grouping feature is registered, a cell can be in
        // one of three special modes that should not render `columnDef.cell`
        // directly:
        //   - aggregated: render `columnDef.aggregatedCell` (falling back to
        //     `columnDef.cell` if the column did not define one)
        //   - placeholder: a duplicate value within a group — render nothing
        //   - grouped: fall through to `columnDef.cell`; consumers that want
        //     a custom group header typically branch on `cell.getIsGrouped()`
        //     themselves first
        if (cell.getIsAggregated?.()) {
          return flexRender(def.aggregatedCell ?? def.cell, cell.getContext())
        }
        if (cell.getIsPlaceholder?.()) {
          return null
        }
        return flexRender(def.cell, cell.getContext())
      }

      if (props.header) {
        return flexRender(
          props.header.column.columnDef.header,
          props.header.getContext(),
        )
      }

      if (props.footer) {
        return flexRender(
          props.footer.column.columnDef.footer,
          props.footer.getContext(),
        )
      }

      // Legacy pattern: use render and props directly
      return flexRender(props.render, props.props)
    }
  },
})
