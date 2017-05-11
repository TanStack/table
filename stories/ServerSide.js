import React from 'react'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from '../src/index'

const rawData = _.map(_.range(3424), d => {
  return {
    firstName: namor.generate({ words: 1, numLen: 0 }),
    lastName: namor.generate({ words: 1, numLen: 0 }),
    age: Math.floor(Math.random() * 30)
  }
})

// Now let's mock the server.  It's job is simple: use the table model to sort and return the page data
const requestData = (pageSize, page, sorted, filtered) => {
  return new Promise((resolve, reject) => {
    // On the server, you'll likely use SQL or noSQL or some other query language to do this.
    // For this mock, we'll just use lodash
    let filteredData = rawData
    if (filtered.length) {
      filteredData = filtered.reduce(
        (filteredSoFar, nextFilter) => {
          return filteredSoFar.filter(
            (row) => {
              return (row[nextFilter.id] + '').includes(nextFilter.value)
            })
        }
        , filteredData)
    }
    const sortedData = _.orderBy(filteredData, sorted.map(sort => {
      return row => {
        if (row[sort.id] === null || row[sort.id] === undefined) {
          return -Infinity
        }
        return typeof row[sort.id] === 'string' ? row[sort.id].toLowerCase() : row[sort.id]
      }
    }), sorted.map(d => d.desc ? 'desc' : 'asc'))

    // Be sure to send back the rows to be displayed and any other pertinent information, like how many pages there are total.
    const res = {
      rows: sortedData.slice(pageSize * page, (pageSize * page) + pageSize),
      pages: Math.ceil(filteredData.length / pageSize)
    }

    // Here we'll simulate a server response with 500ms of delay.
    setTimeout(() => resolve(res), 500)
  })
}

class Story extends React.Component {
  constructor () {
    super()
    this.state = {
      data: [],
      pages: null,
      loading: true
    }
    this.fetchData = this.fetchData.bind(this)
  }
  fetchData (state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({loading: true})
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    requestData(state.pageSize, state.page, state.sorted, state.filtered)
      .then((res) => {
        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        this.setState({
          data: res.rows,
          pages: res.pages,
          loading: false
        })
      })
  }
  render () {
    return (
      <div>
        <div className='table-wrap'>
          <ReactTable
            className='-striped -highlight'
            columns={[{
              Header: 'First Name',
              accessor: 'firstName'
            }, {
              Header: 'Last Name',
              id: 'lastName',
              accessor: d => d.lastName
            }, {
              Header: 'Age',
              accessor: 'age'
            }]}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            defaultPageSize={10}
            filterable
            data={this.state.data} // Set the rows to be displayed
            pages={this.state.pages} // Display the total number of pages
            loading={this.state.loading} // Display the loading overlay when we need it
            onFetchData={this.fetchData} // Request new data when things change
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
const source = require('!raw-loader!./ServerSide')

export default () => (
  <div>
    <Story />
    <CodeHighlight>{() => source}</CodeHighlight>
  </div>
)
