import { h, defineComponent } from 'vue'

export * from '@tanstack/table-core'

export const renderTemplate = (template: string, props?: any) => {
  let propsKeys = typeof props === 'object' ? Object.keys(props) : []
  return h(
    defineComponent({
      props: propsKeys,
      template,
    }),
    props
  )
}
