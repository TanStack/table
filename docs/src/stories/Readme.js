/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import marked from 'marked'
//
import Readme from '!raw!../../../README.md'
import 'github-markdown-css/github-markdown.css'

export default class Story extends React.Component {
  render () {
    return <span className='markdown-body' dangerouslySetInnerHTML={{__html: marked(Readme)}} />
  }
  componentDidMount () {
    global.Prism.highlightAll()
  }
}
