import React from 'react'
//
import ReactStory, { defaultProps } from 'react-story'

import './stories/utils/prism.css'
import '../../react-table.css'

import Readme from './stories/Readme.js'
import Simple from './stories/Simple.js'
import CellRenderers from './stories/CellRenderers.js'
import DefaultSorting from './stories/DefaultSorting.js'
import CustomSorting from './stories/CustomSorting.js'
import CustomWidths from './stories/CustomWidths.js'
import CustomComponentProps from './stories/CustomComponentProps.js'
import ServerSide from './stories/ServerSide.js'
import SubComponents from './stories/SubComponents.js'
import Pivoting from './stories/Pivoting.js'
import PivotingSubComponents from './stories/PivotingSubComponents.js'
import OneHundredKRows from './stories/OneHundredKRows.js'
import FunctionalRendering from './stories/FunctionalRendering.js'
import CustomExpanderPosition from './stories/CustomExpanderPosition.js'
import NoDataText from './stories/NoDataText.js'
import Footers from './stories/Footers.js'
import Filtering from './stories/Filtering.js'
import ControlledTable from './stories/ControlledTable.js'
import PivotingOptions from './stories/PivotingOptions.js'
import EditableTable from './stories/EditableTable.js'
import FixedHeader from './stories/FixedHeader.js'

export default class App extends React.Component {
  render() {
    return (
      <ReactStory
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
        pathPrefix="story/"
        StoryWrapper={props => (
          <defaultProps.StoryWrapper
            css={{
              padding: 0
            }}
          >
            <a
              href="//github.com/tannerlinsley/react-table"
              style={{
                display: 'block',
                textAlign: 'center',
                borderBottom: 'solid 3px #cccccc'
              }}
            >
              <img
                src="//npmcdn.com/react-table/media/Banner.png"
                alt="React Table Logo"
                style={{
                  width: '100px'
                }}
              />
            </a>
            <div
              {...props}
              style={{
                padding: '10px'
              }}
            />
          </defaultProps.StoryWrapper>
        )}
        stories={[
          { name: 'Readme', component: Readme },
          { name: 'Simple Table', component: Simple },
          {
            name: 'Cell Renderers & Custom Components',
            component: CellRenderers
          },
          { name: 'Default Sorting', component: DefaultSorting },
          { name: 'Custom Sorting', component: CustomSorting },
          { name: 'Custom Column Widths', component: CustomWidths },
          { name: 'Custom Component Props', component: CustomComponentProps },
          { name: 'Server-side Data', component: ServerSide },
          { name: 'Sub Components', component: SubComponents },
          { name: 'Pivoting & Aggregation', component: Pivoting },
          {
            name: 'Pivoting & Aggregation w/ Sub Components',
            component: PivotingSubComponents
          },
          {
            name: '100k Rows w/ Pivoting & Sub Components',
            component: OneHundredKRows
          },
          { name: 'Pivoting Options', component: PivotingOptions },
          { name: 'Functional Rendering', component: FunctionalRendering },
          {
            name: 'Custom Expander Position',
            component: CustomExpanderPosition
          },
          { name: 'Custom "No Data" Text', component: NoDataText },
          { name: 'Footers', component: Footers },
          { name: 'Custom Filtering', component: Filtering },
          { name: 'Controlled Component', component: ControlledTable },
          { name: 'Editable Table', component: EditableTable },
          { name: 'Fixed Header w/ Vertical Scroll', component: FixedHeader }
        ]}
      />
    )
  }
}
