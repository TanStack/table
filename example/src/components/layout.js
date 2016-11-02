import { Component, Link } from 'jumpsuit'

export default Component({
  render () {
    return (
      <div className='container'>
        <div style={{textAlign: 'center'}}>
          <h1>
            <span style={{position: 'absolute', textIndent: '-9999em'}}>
              react-table
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
        <div className='menu'>
          <ul>
            <li>
              <Link to='/simple' activeClassName='active'>
                Simple
              </Link>
            </li>
            <li>
              <Link to='/server-side' activeClassName='active'>
                Server-Side
              </Link>
            </li>
          </ul>
        </div>
        <div className='viewport'>
          {this.props.children}
        </div>
      </div>
    )
  }
})
