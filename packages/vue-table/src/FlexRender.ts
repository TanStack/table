import { defineComponent, h } from 'vue'

export const FlexRender = defineComponent({
  props: ['render', 'props'],
  setup: (props: { render: any; props: any }) => {
    return () => {
      if (
        typeof props.render === 'function' ||
        typeof props.render === 'object'
      ) {
        return h(props.render, props.props)
      }

      return props.render
    }
  },
})
