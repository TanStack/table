import React from 'react'
import classnames from 'classnames'
//
// import _ from './utils'

const defaultButton = (props) => (
  <button {...props} className='-btn'>{props.children}</button>
)

export default React.createClass({
  getInitialState () {
    return {
      page: this.props.currentPage
    }
  },
  componentWillReceiveProps (nextProps) {
    this.setState({page: nextProps.currentPage})
  },
  getSafePage (page) {
    return Math.min(Math.max(page, 0), this.props.pagesLength - 1)
  },
  changePage (page) {
    page = this.getSafePage(page)
    this.setState({page})
    this.props.onChange(page)
  },
  applyPage (e) {
    e && e.preventDefault()
    const page = this.state.page
    this.changePage(page === '' ? this.props.currentPage : page)
  },
  render () {
    const {
      currentPage,
      pagesLength,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className
    } = this.props

    const PreviousComponent = this.props.previousComponent || defaultButton
    const NextComponent = this.props.nextComponent || defaultButton

    return (
      <div
        className={classnames(className, '-pagination')}
        style={this.props.paginationStyle}
      >
        <div className='-previous'>
          <PreviousComponent
            onClick={(e) => {
              if (!canPrevious) return
              this.changePage(currentPage - 1)
            }}
            disabled={!canPrevious}
          >
            {this.props.previousText}
          </PreviousComponent>
        </div>
        <div className='-center'>
          <span className='-pageInfo'>
            {this.props.pageText} {showPageJump ? (
              <form className='-pageJump'
                onSubmit={this.applyPage}
              >
                <input
                  type={this.state.page === '' ? 'text' : 'number'}
                  onChange={e => {
                    const val = e.target.value
                    const page = val - 1
                    if (val === '') {
                      return this.setState({page: val})
                    }
                    this.setState({page: this.getSafePage(page)})
                  }}
                  value={this.state.page === '' ? '' : this.state.page + 1}
                  onBlur={this.applyPage}
                />
              </form>
              ) : (
                <span className='-currentPage'>{currentPage + 1}</span>
            )} {this.props.ofText} <span className='-totalPages'>{pagesLength}</span>
          </span>
          {showPageSizeOptions && (
            <span className='select-wrap -pageSizeOptions'>
              <select
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                value={pageSize}
              >
                {pageSizeOptions.map((option, i) => {
                  return (
                    <option
                      key={i}
                      value={option}>
                      {option} {this.props.rowsText}
                    </option>
                  )
                })}
              </select>
            </span>
          )}
        </div>
        <div className='-next'>
          <NextComponent
            onClick={(e) => {
              if (!canNext) return
              this.changePage(currentPage + 1)
            }}
            disabled={!canNext}
          >
            {this.props.nextText}
          </NextComponent>
        </div>
      </div>
    )
  }
})
