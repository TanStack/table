export const defaultColumnCell = (props: {
  renderValue: <TTValue = unknown>() => TTValue
}) => props.renderValue<any>()?.toString?.() ?? null
