/* eslint-disable */

import React from 'react';
//
import ReactStory, { defaultProps } from 'react-story';
import { CodeSandbox, CodeSandboxId} from './CodeSandbox.js';
import './stories/utils/prism.css';
import '../../react-table.css';

import Readme from './stories/Readme.js';
import HOCReadme from './stories/HOCReadme.js';

// import Test from './stories/test.js'

// import Tester from './examples/expander';

const stories = [
  { name: 'Readme', component: Readme },
  { name: 'HOC Readme', component: HOCReadme },

  // { name: 'Tester', component: Test },
  { name: 'Simple Table', component: CodeSandbox('simple-table') },
  {
    name: 'Cell Renderers & Custom Components', component: CodeSandbox('cell-renderers')
  },
  { name: 'Default Sorting', component: CodeSandbox('default-sorting') },
  {
    name: 'Custom Sorting', component: CodeSandbox('custom-sorting')
  },
  { name: 'Custom Column Widths', component: CodeSandbox('custom-column-widths') },
  { name: 'Custom Component Props', component: CodeSandbox('custom-component-props') },
  { name: 'Server-side Data', component: CodeSandbox('server-side-data') },
  { name: 'Sub Components', component: CodeSandbox('sub-components') },
  { name: 'Pivoting & Aggregation', component: CodeSandbox('pivoting-and-aggregation') },
  {
    name: 'Pivoting & Aggregation w/ Sub Components', component: CodeSandbox('pivoting-sub-components')
  },
  {
    name: '100k Rows w/ Pivoting & Sub Components', component: CodeSandbox('100k-rows-aggregation')
  },
  { name: 'Pivoting Options', component: CodeSandbox('pivoting-options') },
  { name: 'Functional Rendering', component: CodeSandbox('functional-rendering') },
  {
    name: 'Custom Expander Position', component: CodeSandbox('custom-expander-position')
  },
  { name: 'Custom "No Data" Text', component: CodeSandbox('custom-no-data-text') },
  { name: 'Footers', component: CodeSandbox('footers') },
  { name: 'Custom Filtering', component: CodeSandbox('custom-filtering') },
  { name: 'Controlled Component', component: CodeSandbox('controlled-table') },
  { name: 'Editable Table', component: CodeSandbox('editable-content') },
  {
    name: 'Fixed Header w/ Vertical Scroll', component: CodeSandbox('fixed-header-vertical-scroll')
  },
  {
    name: 'Multiple Pagers (Top and Bottom)', component: CodeSandbox('multiple-pagination-bars')
  },

 { name: 'Tree Table (HOC)', component: CodeSandboxId('lxmr4wynzq') },
  { name: 'Select Table (HOC)', component: CodeSandboxId('7yq5ylw09j') },
  { name: 'Select Tree Table (HOC)', component: CodeSandboxId('2p7jp4klwp') },
  { name: 'Foldable Table (HOC)', component: CodeSandboxId('8pkrj5yorl') },
  { name: 'Advanced Expand Table (HOC)', component: CodeSandboxId('y2m39jz8v1') }
];

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
              padding: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <a
              href="//github.com/react-tools/react-table"
              style={{
                display: 'block',
                textAlign: 'center',
                borderBottom: 'solid 3px #cccccc'
              }}
            >
              <img
                src="https://github.com/react-tools/media/raw/master/logo-react-table.png"
                alt="React Table Logo"
                style={{
                  width: '150px',
                  padding: '10px'
                }}
              />
            </a>
            <div
              {...props}
              style={{
                flex: '1 0 auto',
                position: 'relative'
              }}
            />
          </defaultProps.StoryWrapper>
        )}
        stories={stories}
      />
    );
  }
}
