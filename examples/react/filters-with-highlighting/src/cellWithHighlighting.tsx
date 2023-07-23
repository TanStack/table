import React from 'react'
import { CellContext } from '@tanstack/react-table'
import {
  HIGHLIGHT_RANGE_END,
  HIGHLIGHT_RANGE_START,
  HighlightRange,
  getHighlightRanges,
} from './filtersWithHighlighting'

function splitNewlines(value: string) {
  return value
    .split('\n')
    .map((line, index) => [
      index > 0 ? <br key={`br-${index}`} /> : undefined,
      line,
    ])
}

function splitHighlights(
  value: string,
  ranges: HighlightRange[],
  ignoreNewlines: boolean = false
) {
  const handleRange = ignoreNewlines ? (range: string) => range : splitNewlines
  const lastRange = value.slice(
    ranges.length > 0 ? ranges[ranges.length - 1]![HIGHLIGHT_RANGE_END] : 0
  )
  return [
    ...ranges.map((range, index, array) => {
      const spanRange = value.slice(
        index > 0 ? array[index - 1]![HIGHLIGHT_RANGE_END] : 0,
        range[HIGHLIGHT_RANGE_START]
      )
      const markRange = value.slice(
        range[HIGHLIGHT_RANGE_START],
        range[HIGHLIGHT_RANGE_END]
      )
      return [
        <span
          key={`span-${range[HIGHLIGHT_RANGE_START]}-${range[HIGHLIGHT_RANGE_END]}`}
        >
          {handleRange(spanRange)}
        </span>,
        <mark
          key={`mark-${range[HIGHLIGHT_RANGE_START]}-${range[HIGHLIGHT_RANGE_END]}`}
        >
          {handleRange(markRange)}
        </mark>,
      ]
    }),
    <span key="span-last">{handleRange(lastRange)}</span>,
  ]
}

export const cellWithHighlighting = (props: CellContext<any, string>) =>
  splitHighlights(props.cell.getValue(), getHighlightRanges(props))
