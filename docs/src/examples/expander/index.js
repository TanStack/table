/* eslint-disable */

import React from 'react';

import ReactTable from '../../../../lib/index'
import '../../../../react-table.css'

const data = [
  {one:"1.1",two:"1.2"},
  {one:"2.1",two:"2.2"},
  {one:"3.1",two:"3.2"},
  {one:"4.1",two:"4.2"},
]

const columns = [
  {accessor:'one', Header: 'One'},
  {accessor:'two', Header: 'Two'},
]

class ExpanderComponent extends React.Component {
  render()
  {
    return (
      <div className={`rt-expander ${this.props.isExpanded ? '-open' : ''}`}>
        &bull;
      </div>                
    )
  }
}

class SubComponent extends React.Component {
  render()
  {
    return <div>Nothing</div>
  }
}

export default class ComponentTest extends React.Component {
  render()
  {
    const rtProps = {
      data,
      columns,
      ExpanderComponent: (props)=><ExpanderComponent {...props} />,
      SubComponent: (props)=><SubComponent {...props} />,
      multiSort: false,
    }
    return (
      <ReactTable 
        {...rtProps}
      />
    )
  }
}
