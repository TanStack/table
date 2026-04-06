import { defineComponent, h, isVNode } from 'vue'

export const FlexRender = defineComponent({
  props: ['render', 'props'],
  setup: (props: { render: any; props: any }) => {
    return () => {
      if (typeof props.render === 'function') {
        const rendered = props.render(props.props)

        if (isVNode(rendered)) {
          return rendered
        }

        if (typeof rendered === 'function' || typeof rendered === 'object') {
          return h(rendered, props.props)
        }

        return rendered
      }

      if (typeof props.render === 'object') {
        return h(props.render, props.props)
      }

      return props.render
    }
  },
})
