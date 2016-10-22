import { Component } from 'jumpsuit'
import _ from 'lodash'
import namor from 'namor'

import ReactTable from 'react-table'

export default Component({
  render () {
    const data = _.map(_.range(5000), d => {
      return {
        firstName: namor.generate({ words: 1, numLen: 0 }),
        lastName: namor.generate({ words: 1, numLen: 0 }),
        age: Math.floor(Math.random() * 30)
      }
    })

    const columns = [{
      header: 'Name',
      columns: [{
        header: 'First Name',
        accessor: 'firstName'
      }, {
        header: 'Last Name',
        accessor: 'lastName'
      }]
    }, {
      header: 'Info',
      columns: [{
        header: 'Age',
        accessor: 'age'
      }]
    }]

    return (
      <div className='container'>
        <div style={{textAlign: 'center'}}>
          <h1>
            <span style={{position: 'absolute', textIndent: '-9999em'}}>
              react-table <strong>demo</strong>
            </span>
            <img src='/Banner.png' className='logo' />
          </h1>
          <br />
          <div>
            <a
              className='github-button'
              href='https://github.com/tannerlinsley/react-table'
              target='_blank'
              data-style='mega'
              data-count-href='/tannerlinsley/react-table/stargazers'
              data-count-api='/repos/tannerlinsley/react-table#stargazers_count'
              data-count-aria-label='# stargazers on GitHub'
              aria-label='Star tannerlinsley/react-table on GitHub'>
              Star
            </a>
          </div>
          <br />
          <div className='github-addon'>
            <a
              target='_blank'
              href='https://github.com/tannerlinsley/react-table'>
              View on Github
            </a>
          </div>
          <br />
          <br />
        </div>
        <div className='table-wrap'>
          <ReactTable
            data={data}
            columns={columns}
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <br />
          <em>Tip: Hold shift when sorting to multi-sort!</em>
        </div>
      </div>
    )
  }
})
