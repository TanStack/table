// @ts-ignore
import { mount } from 'svelte'
import Root from './Root.svelte'

const app = mount(Root, {
  target: document.getElementById('root')!,
})

export default app
