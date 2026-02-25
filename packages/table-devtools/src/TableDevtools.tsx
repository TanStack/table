import { TableContextProvider } from './TableContextProvider'
import { Shell } from './components/Shell'

export default function TableDevtools() {
  return (
    <TableContextProvider>
      <Shell />
    </TableContextProvider>
  )
}
