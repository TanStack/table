import { Component } from 'jumpsuit'
import _ from 'lodash'
import namor from 'namor'

import CodeHighlight from 'components/codeHighlight'
import ReactTable from '../../../lib/index.js'

// Let's mock some data to play around with
const rawData = _.map(_.range(3424), d => {
  return {
    firstName: namor.generate({ words: 1, numLen: 0 }),
    lastName: namor.generate({ words: 1, numLen: 0 }),
    age: Math.floor(Math.random() * 30)
  }
})

// Now let's mock the server.  It's job is simple: use the table model to sort and return the page data
const requestData = (pageSize, page, sorting) => {
  return new Promise((resolve, reject) => {
    // On the server, you'll likely use SQL or noSQL or some other query language to do this.
    // For this mock, we'll just use lodash
    const sortedData = _.orderBy(rawData, sorting.map(sort => {
      return row => {
        if (row[sort.id] === null || row[sort.id] === undefined) {
          return -Infinity
        }
        return typeof row[sort.id] === 'string' ? row[sort.id].toLowerCase() : row[sort.id]
      }
    }), sorting.map(d => d.asc ? 'asc' : 'desc'))

    // Be sure to send back the rows to be displayed and any other pertinent information, like how many pages there are total.
    const res = {
      rows: sortedData.slice(pageSize * page, (pageSize * page) + pageSize),
      pages: Math.ceil(rawData.length / pageSize)
    }

    // Here we'll simulate a server response with 500ms of delay.
    setTimeout(() => resolve(res), 500)
  })
}

export default Component({
  getInitialState () {
    // To handle our data server-side, we need a few things in the state to help us out:
    return {
      data: [],
      pages: null,
      loading: true
    }
  },
  fetchData (state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({loading: true})
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    requestData(state.pageSize, state.page, state.sorting)
      .then((res) => {
        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        this.setState({
          data: res.rows,
          pages: res.pages,
          loading: false
        })
      })
  },
  render () {
    return (
      <div>
        <div className='table-wrap'>
          <ReactTable
            columns={[{
              header: 'Name',
              columns: [{
                header: 'First Name',
                accessor: 'firstName'
              }, {
                header: 'Last Name',
                id: 'lastName',
                accessor: d => d.lastName
              }]
            }, {
              header: 'Info',
              columns: [{
                header: 'Age',
                accessor: 'age'
              }]
            }]}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            pageSize={10}
            data={this.state.data} // Set the rows to be displayed
            pages={this.state.pages} // Display the total number of pages
            loading={this.state.loading} // Display the loading overlay when we need it
            onChange={this.fetchData} // Request new data when things change
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <br />
          <em>Tip: Hold shift when sorting to multi-sort!</em>
        </div>
        <CodeHighlight>{getCode()}</CodeHighlight>
      </div>
    )
  }
})

function getCode () {
  return `
import ReactTable from 'react-table'
import Axios from 'axios'

export default React.creatClass({
  getInitialState () {
    // To handle our data server-side, we need to keep track of our table state
    return {
      data: [],
      pages: null,
      loading: true
    }
  },
  fetchData (state, instance) {
    // Whenever the table model changes (sorting, pagination, etc), this method gets called and passed the current table model.
    // You can set the 'loading' prop of the table to true to use the built-in loading notice, or show you're own loading bar if you want.
    this.setState({loading: true})
    // Request the data from a server however you want! Be sure to send the bits of the table model that it may neeed.
    Axios.post('mysite.com/data', {
      pageSize: state.pageSize,
      page: state.page,
      sorting: state.sorting
    })
      .then((res) => {
        // Now update your state!
        this.setState({
          data: res.rows,
          pages: res.pages,
          loading: false
        })
      })
  },
  render () {
    const columns = [{
      header: 'Name',
      columns: [{
        header: 'First Name',
        accessor: 'firstName'
      }, {
        header: 'Last Name',
        id: 'lastName',
        accessor: d => d.lastName
      }]
    }, {
      header: 'Info',
      columns: [{
        header: 'Age',
        accessor: 'age'
      }]
    }]

    return (
      <ReactTable
        columns={columns}
        manual // This forces table not to paginate or sort automatically, so we can handle things server-side
        data={this.state.data} // Set the rows to be displayed
        pages={this.state.pages} // Display the total number of pages
        loading={this.state.loading} // Display the loading overlay when we need it
        onChange={this.fetchData} // Request new data when things change
      />
    )
  }
})
  `
}
