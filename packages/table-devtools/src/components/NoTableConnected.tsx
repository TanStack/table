import { useStyles } from '../styles/use-styles'

export function NoTableConnected(props: { title: string }) {
  const styles = useStyles()

  return (
    <div class={styles().panelScroll}>
      <div class={styles().sectionTitle}>{props.title}</div>
      <div class={styles().rowModelItem}>
        No table is connected. Register a table with TanStack Table Devtools to
        inspect it here.
      </div>
    </div>
  )
}
