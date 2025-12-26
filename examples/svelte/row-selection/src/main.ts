import App from './App.svelte'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

new App({
  target: rootElement,
})
