import React, { Component } from 'react'
import _ from 'lodash'

const createStreamTable = (ReactTable, {
  getPage,
  continueStreamOnError,
}) => class RTStreamTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      totalRecords: 0,
      pagesLoaded: 0,
      data: [],
      isStreaming: false,
    }

    this.streamPages = this.streamPages.bind(this)
    this.fetchPageData = this.fetchPageData.bind(this)
    this.getData = this.getData.bind(this)

    this.continueStreamOnError = continueStreamOnError || false
    this.getPage = getPage
  }

  getData (page) {
    const initial = page === 1
    return new Promise((resolve, reject) => {
      this.getPage(page)
        .then(response => {
          const data = this.state.data.concat(_.get(response, this.props.dataLocation))

          const update = {
            data,
            isStreaming: true,
          }

          if (initial) {
            const totalRecords = _.get(response, this.props.totalRecordsLocation)
            update.totalRecords = totalRecords
          }

          this.setState(update)
          resolve(data.length)
        })
        .catch(error => {
          if (initial) {
            reject(error)
          } else if (continueStreamOnError) {
            console.warn(error)
            resolve()
          } else {
            reject(new Error('Failed to load data'))
          }
        })
    })
  }

  componentDidMount () {
    this.getData(1)
      .then(perPage => {
        this.streamPages(perPage)
      })
      .catch(error => {
        console.error('Failed to load data')
        console.error(error)
      })
  }

  streamPages (perPage) {
    const totalPages = Math.ceil(this.state.totalRecords / perPage)

    this.fetchPageData(2, totalPages)
  }

  fetchPageData (currentPage, totalPages) {
    if (currentPage > totalPages) {
      this.setState({
        isStreaming: false,
      })
      return
    }

    this.getData(currentPage)
      .then(() => {
        this.fetchPageData(currentPage + 1, totalPages)
      })
      .catch(error => {
        console.error(error)
      })
  }

  render () {
    const {
      totalRecordsLocation,
      dataLocation,
      ...otherProps
    } = this.props

    // TODO: Add CSS class names for wrappers
    return (
        <React.Fragment>
          {
            this.state.isStreaming ? (
              <progress max={this.state.totalRecords} value={this.state.data.length} />
            ) : null
          }
          <ReactTable
            {...otherProps}
            data={this.state.data}
          />
        </React.Fragment>
    )
  }
}


export default createStreamTable
