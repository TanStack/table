import { render } from 'solid-js/web'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(() => <App />, rootElement)
