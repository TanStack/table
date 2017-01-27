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
import CellRenderers from '../stories/CellRenderers.js'
import MaxWidths from '../stories/MaxWidths.js'
import ServerSide from '../stories/ServerSide.js'
import SubComponents from '../stories/SubComponents.js'
import Pivoting from '../stories/Pivoting.js'
import PivotingSubComponents from '../stories/PivotingSubComponents.js'
import OneHundredKRows from '../stories/OneHundredKRows.js'
import FunctionalRendering from '../stories/FunctionalRendering.js'
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
    .add('Simple Table', Simple)
    .add('Cell Renderers & Custom Components', CellRenderers)
    .add('Max Widths', MaxWidths)
    .add('Server-side Data', ServerSide)
    .add('Sub Components', SubComponents)
    .add('Pivoting & Aggregation', Pivoting)
    .add('Pivoting & Aggregation w/ Sub Components', PivotingSubComponents)
    .add('100k Rows w/ Pivoting & Sub Components', OneHundredKRows)
    .add('Functional Rendering', FunctionalRendering)
}, module)
