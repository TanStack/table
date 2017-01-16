import React from 'react'
import { configure, storiesOf } from '@kadira/storybook'

import './reset.css'
import './fonts.css'
import './layout.css'
import '../stories/utils/prism.css'
import 'github-markdown-css/github-markdown.css'
import '../react-table.css'
//
import Readme from '../README.md'
//
import Simple from '../stories/Simple.js'
import ServerSide from '../stories/ServerSide.js'
import SubComponents from '../stories/SubComponents.js'
import Pivoting from '../stories/Pivoting.js'
import PivotingSubComponents from '../stories/PivotingSubComponents.js'
import MillionRows from '../stories/MillionRows.js'
//
configure(() => {
  storiesOf('1. Docs')
    .add('Readme', () => {
      const ReadmeCmp = React.createClass({
        render () {
          return <span className='markdown-body' dangerouslySetInnerHTML={{__html: Readme}} />
        },
        componentDidMount () {
          global.Prism.highlightAll()
        }
      })
      return <ReadmeCmp />
    })
  storiesOf('2. Demos')
    .add('Client-side Data', Simple)
    .add('Server-side Data', ServerSide)
    .add('Sub Components', SubComponents)
    .add('Pivoting & Aggregation', Pivoting)
    .add('Pivoting & Aggregation w/ Sub Components', PivotingSubComponents)
    .add('1 Million Rows w/ Pivoting & Sub Components', MillionRows)
}, module)
