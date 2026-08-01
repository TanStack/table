import { render } from 'solid-js/web'
import { Spreadsheet } from './Spreadsheet'
import './index.css'

/**
 * This example is purely experimental and intended for exploration.
 * TanStack Table is a data-grid engine rather than a complete spreadsheet;
 * this demonstrates how far its primitives can be taken in Solid.
 */
const root = document.getElementById('root')
if (!root) throw new Error('Failed to find the root element')
render(() => <Spreadsheet />, root)
