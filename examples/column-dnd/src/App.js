import React from 'react'
import Table from './Table'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Preview from './Preview'

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Table />
      <Preview />
    </DndProvider>
  )
}
