import { Component } from 'jumpsuit'
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from '../../node_modules/react-syntax-highlighter/dist/styles/atom-one-dark'

export default Component({
  render () {
    return (
      <SyntaxHighlighter language='javascript' style={atomOneDark}>{this.props.children}</SyntaxHighlighter>
    )
  }
})
