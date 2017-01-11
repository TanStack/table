import React from 'react'
import '../utils/prism'

export default React.createClass({
  render () {
    const { language, children } = this.props
    return (
      <pre>
        <code className={'language-' + (language || 'jsx')}>
          {children()}
        </code>
      </pre>
    )
  },
  componentDidMount () {
    window.Prism.highlightAll()
  },
  componentDidUpdate () {
    window.Prism.highlightAll()
  }
})
