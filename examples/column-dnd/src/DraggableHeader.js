import React, { useEffect, useMemo, useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import ItemTypes from './itemTypes'
import styled from 'styled-components'

const StyledTh = styled.th`
  cursor: move;
  opacity: ${props => (props.isDragging ? 0 : 1)};
`

const DraggableHeader = ({ column, index, reoder }) => {
  const ref = useRef()
  const { id, Header } = column

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    drop: item => {
      reoder(item, index)
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.COLUMN,
    item: () => {
      return {
        id,
        index,
        header: Header,
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  drag(drop(ref))

  const memoizedColumn = useMemo(() => column.render('Header'), [column])

  return (
    <StyledTh ref={ref} isDragging={isDragging} {...column.getHeaderProps()}>
      {memoizedColumn}
    </StyledTh>
  )
}

export default DraggableHeader
