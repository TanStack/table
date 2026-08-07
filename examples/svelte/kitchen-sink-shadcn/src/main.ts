// @ts-ignore -- svelte module types
import { mount } from 'svelte'
import App from './App.svelte'
import './index.css'
// Applies the persisted theme class on load.
import '@/lib/theme.svelte'

const app = mount(App, {
  target: document.getElementById('root')!,
})

export default app
