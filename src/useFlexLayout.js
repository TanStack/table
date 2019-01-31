import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { getFirstDefined, sum } from './utils'

const propTypes = {
  defaultFlex: PropTypes.number,
}

export const actions = {}

export default function useFlexLayout (api, props = {}) {
  // Validate props
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useFlexLayout')

  const {
    hooks: {
      getRowProps, getHeaderRowProps, getHeaderProps, getCellProps,
    },
    visibleColumns,
  } = api

  const { defaultFlex = 1 } = props

  const [columnMeasurements, setColumnMeasurements] = useState({})

  const rowStyles = useMemo(
    () => {
      let sumWidth = 0
      visibleColumns.forEach(column => {
        const { width, minWidth } = getSizesForColumn(
          column,
          defaultFlex,
          undefined,
          undefined,
          api
        )
        if (width) {
          sumWidth += width
        } else if (minWidth) {
          sumWidth += minWidth
        } else {
          sumWidth += defaultFlex
        }
      })

      return {
        style: {
          display: 'flex',
          minWidth: `${sumWidth}px`,
        },
      }
    },
    [visibleColumns]
  )

  getRowProps.push(row => rowStyles)
  getHeaderRowProps.push(row => rowStyles)

  getHeaderProps.push(column => ({
    style: {
      boxSizing: 'border-box',
      ...getStylesForColumn(column, columnMeasurements, defaultFlex, api),
    },
    // [refKey]: el => {
    //   renderedCellInfoRef.current[key] = {
    //     column,
    //     el
    //   };
    // },
  }))

  getCellProps.push(cell => ({
    style: {
      display: 'block',
      boxSizing: 'border-box',
      ...getStylesForColumn(cell.column, columnMeasurements, defaultFlex, undefined, api),
    },
    // [refKey]: el => {
    //   renderedCellInfoRef.current[columnPathStr] = {
    //     column,
    //     el
    //   };
    // }
  }))

  return {
    rowStyles,
  }
}

function getStylesForColumn (column, columnMeasurements, defaultFlex, api) {
  const { flex, width, maxWidth } = getSizesForColumn(column, columnMeasurements, defaultFlex, api)

  return {
    flex: `${flex} 0 auto`,
    width: `${width}px`,
    maxWidth: `${maxWidth}px`,
  }
}

function getSizesForColumn (
  {
    columns, id, width, minWidth, maxWidth,
  },
  columnMeasurements,
  defaultFlex,
  api
) {
  if (columns) {
    columns = columns
      .map(column => getSizesForColumn(column, columnMeasurements, defaultFlex, api))
      .filter(Boolean)

    if (!columns.length) {
      return false
    }

    const flex = sum(columns.map(col => col.flex))
    const width = sum(columns.map(col => col.width))
    const maxWidth = sum(columns.map(col => col.maxWidth))

    return {
      flex,
      width,
      maxWidth,
    }
  }

  return {
    flex: width ? 0 : defaultFlex,
    width:
      width === 'auto'
        ? columnMeasurements[id] || defaultFlex
        : getFirstDefined(width, minWidth, defaultFlex),
    maxWidth,
  }
}

// const resetRefs = () => {
//   if (debug) console.info("resetRefs");
//   renderedCellInfoRef.current = {};
// };

// const calculateAutoWidths = () => {
//   RAF(() => {
//     const newColumnMeasurements = {};
//     Object.values(renderedCellInfoRef.current).forEach(({ column, el }) => {
//       if (!el) {
//         return;
//       }

//       let measurement = 0;

//       const measureChildren = children => {
//         if (children) {
//           [].slice.call(children).forEach(child => {
//             measurement = Math.max(
//               measurement,
//               Math.ceil(child.offsetWidth) || 0
//             );
//             measureChildren(child.children);
//           });
//         }
//         return measurement;
//       };

//       const parentDims = getElementDimensions(el);
//       measureChildren(el.children);

//       newColumnMeasurements[column.id] = Math.max(
//         newColumnMeasurements[column.id] || 0,
//         measurement + parentDims.paddingLeft + parentDims.paddingRight
//       );
//     });

//     const oldKeys = Object.keys(columnMeasurements);
//     const newKeys = Object.keys(newColumnMeasurements);

//     const needsUpdate =
//       oldKeys.length !== newKeys.length ||
//       oldKeys.some(key => {
//         return columnMeasurements[key] !== newColumnMeasurements[key];
//       });

//     if (needsUpdate) {
//       setState(old => {
//         return {
//           ...old,
//           columnMeasurements: newColumnMeasurements
//         };
//       }, actions.updateAutoWidth);
//     }
//   });
// };
