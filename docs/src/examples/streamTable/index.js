import React, { Component } from 'react'
import createStreamTable from '../../../../lib/hoc/streamTable'
import ReactTable from '../../../../lib/index'
import '../../../../react-table.css'
import mockData from './mockData'

function getPage (page) {
  const perPage = 50
  return new Promise(resolve => {
    const response = {
      meta: {
        total_records: mockData.length,
      },
      users: mockData.slice((page - 1) * perPage, page * perPage),
    }

    setTimeout(() => {
      resolve(response)
    }, 800)
  })
}

class StreamTableExample extends Component {
  render () {
    const StreamTable = createStreamTable(ReactTable, {
      getPage,
      continueStreamOnError: true,
    })

    return (
      <StreamTable
        totalRecordsLocation='meta.total_records'
        dataLocation='users'
        columns={[
          { Header: 'Fist Name', accessor: 'first_name' },
          { Header: 'Last Name', accessor: 'last_name' },
          { Header: 'Email', accessor: 'email' },
          { Header: 'Gender', accessor: 'gender' },
          { Header: 'IP', accessor: 'ip_address' },
        ]}
        defaultPageSize={25}
      />
    )
  }
}

export default StreamTableExample
