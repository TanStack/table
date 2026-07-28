import React from 'react'
import ReactDOM from 'react-dom/client'
import { Spreadsheet } from './Spreadsheet'
import './index.css'

/**
 * This example is purely experimental and intended for exploration.
 *
 * TanStack Table is designed around web data-grid standards, not full
 * spreadsheet behavior. TanStack Table alone cannot fully reimplement every
 * Excel-like feature, and it is not intended to do so. This example instead
 * demonstrates how much spreadsheet-like functionality and performance can
 * be achieved on the web with TanStack Table as the underlying engine.
 */
const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Spreadsheet />
  </React.StrictMode>,
)
