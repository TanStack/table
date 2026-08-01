import { mount } from 'svelte'
import App from './App.svelte'

/** Experimental spreadsheet exploration built with TanStack Table. */
const target = document.getElementById('root')
if (!target) throw new Error('Failed to find the root element')
mount(App, { target })
