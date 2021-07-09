import React from 'react'
import { useDragLayer } from 'react-dnd'
import styled from 'styled-components'

const StyledPreview = styled.div.attrs({
  style: props => ({
    padding: '.5rem',
    fontWeight: 'bold',
    position: 'fixed',
    pointerEvents: 'none',
    left: 0,
    top: 0,
    transform: `translate(${props.x}px, ${props.y}px) rotate(25deg)`,
    background: 'red',
  }),
})``

const Preview = () => {
  const { isDragging, item, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  const { x, y } = currentOffset || {}

  return isDragging ? (
    <StyledPreview x={x} y={y}>
      {item.header}
    </StyledPreview>
  ) : null
}

export default Preview
