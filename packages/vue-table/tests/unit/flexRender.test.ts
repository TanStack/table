import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isVNode } from 'vue'
import { flexRender } from '../../src/FlexRender'

describe('flexRender', () => {
  test('returns primitives, callbacks, VNodes, and component objects', () => {
    const props = { value: 'Ada' }
    const renderCallback = vi.fn(
      (context: typeof props) => `Hello ${context.value}`,
    )

    expect(flexRender(null, props)).toBeNull()
    expect(flexRender(undefined, props)).toBeUndefined()
    expect(flexRender(0, props)).toBe(0)
    expect(flexRender(() => null, props)).toBeNull()
    expect(flexRender('Plain text', props)).toBe('Plain text')
    expect(flexRender(renderCallback, props)).toBe('Hello Ada')
    expect(renderCallback).toHaveBeenCalledWith(props)

    const existingVNode = h('strong', 'Existing')
    expect(flexRender(() => existingVNode, props)).toBe(existingVNode)

    const NameComponent = defineComponent({
      props: {
        value: {
          type: String,
          required: true,
        },
      },
      setup(componentProps) {
        return () => h('span', `Name: ${componentProps.value}`)
      },
    })
    const componentVNode = flexRender(NameComponent, props)

    expect(isVNode(componentVNode)).toBe(true)
    expect(componentVNode.type).toBe(NameComponent)
    expect(componentVNode.props).toMatchObject(props)

    const returnedComponentVNode = flexRender(() => NameComponent, props)

    expect(isVNode(returnedComponentVNode)).toBe(true)
    expect(returnedComponentVNode.type).toBe(NameComponent)
    expect(returnedComponentVNode.props).toMatchObject(props)
  })
})
