/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../../../lib'

const data = _.map(_.range(5553), d => {
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30)
  }
});

class Story extends React.PureComponent {

  constructor(props)
  {
    super(props);

    this.onResizedChange = this.onResizedChange.bind(this);
    this.resetColumns    = this.resetColumns.bind(this);
    this.getColumns      = this.getColumns.bind(this);
    this.getDefaultResizedState = this.getDefaultResizedState.bind(this);

    this.state =
    {
      resized:[]
    };

  }

  getColumns()
  {


    return [
      {Header:'Zoot', columns:[{
        Header: 'First Name',
        accessor: 'firstName',
        width: 100
      }, {
        Header: 'Last Name',
        accessor: 'lastName'
      }]},
      {Header:'Yarg', columns:[{
        Header: 'Age',
        accessor: 'age',
        width: 50
      }]}

    ]
  }

  getDefaultResizedState()
  {
    var columns = this.getColumns();

    var resized = columns.map(function(col){
      return {id: col.id, value: col.width || null}
    });

    return resized;
  }

  onResizedChange(resized)
  {
    this.setState({resized});
  }

  resetColumns()
  {
    this.setState({resized:[]});
  }

  render () {

    console.log('Resized State', this.state.resized);

    const columns = this.getColumns()

    return (
      <div>
        <button onClick={this.resetColumns}>Reset Columns</button>
        <hr/>
        <pre><code><strong>Resized State = </strong>{JSON.stringify(this.state.resized, null, 2)}</code></pre>
        <hr/>
        <div className='table-wrap'>
          <ReactTable
            className='-striped -highlight'
            data={data}
            columns={columns}
            onResizedChange={this.onResizedChange}
            resized={this.state.resized}
            defaultPageSize={10}
            defaultSorted={[{
              id: 'age',
              desc: true
            }]}
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <br />
          <em>Tip: Hold shift when sorting to multi-sort!</em>
        </div>
      </div>
    )
  }
}

// Source Code
const CodeHighlight = require('./components/codeHighlight').default
const source = require('!raw!./DefaultSorting')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
