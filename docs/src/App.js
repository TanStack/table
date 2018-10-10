/* eslint-disable */

import React from "react";
//
import ReactStory, { defaultProps } from "react-story";
import CodeSandbox from "./CodeSandbox.js";
import "./stories/utils/prism.css";
import "../../react-table.css";

import Readme from "./stories/Readme.js";
import HOCReadme from "./stories/HOCReadme.js";

// import Test from './stories/test.js'

// import Tester from './examples/expander';

const stories = [
  { name: 'Readme', component: Readme },
  { name: 'HOC Readme', component: HOCReadme },

  // { name: 'Tester', component: Test },
  { name: "Simple Table", component: CodeSandbox("X6npLXPRW") },
  {
    name: "Cell Renderers & Custom Components",
    component: CodeSandbox("OyRL04Z4Y")
  },
  { name: "Default Sorting", component: CodeSandbox("gLwmmjzA3") },
  {
    name: "Custom Sorting",
    component: CodeSandbox("VGx67J35")
  },
  { name: "Custom Column Widths", component: CodeSandbox("o2OORXNXN") },
  { name: "Custom Component Props", component: CodeSandbox("nZW3L0wp4") },
  { name: "Server-side Data", component: CodeSandbox("wjrn8wy3R") },
  { name: "Sub Components", component: CodeSandbox("n2gqAxl7") },
  { name: "Pivoting & Aggregation", component: CodeSandbox("oNY9z8xN") },
  {
    name: "Pivoting & Aggregation w/ Sub Components",
    component: CodeSandbox("p0kEVBgQ")
  },
  {
    name: "100k Rows w/ Pivoting & Sub Components",
    component: CodeSandbox("DRmKj0XyK")
  },
  { name: "Pivoting Options", component: CodeSandbox("kZKmNBK6r") },
  { name: "Functional Rendering", component: CodeSandbox("VPZ0Bzv8X") },
  {
    name: "Custom Expander Position",
    component: CodeSandbox("1jj2XrPEV")
  },
  { name: 'Custom "No Data" Text', component: CodeSandbox("RgRpRDv80") },
  { name: "Footers", component: CodeSandbox("KOqQXn3p8") },
  { name: "Custom Filtering", component: CodeSandbox("5Eyxxxyx") },
  { name: "Controlled Component", component: CodeSandbox("r7XEZRK2") },
  { name: "Editable Table", component: CodeSandbox("n5r19gzQP") },
  {
    name: "Fixed Header w/ Vertical Scroll",
    component: CodeSandbox("7LY0gjA8O")
  },
  {
    name: "Multiple Pagers (Top and Bottom)",
    component: CodeSandbox("VEZ8OgvX")
  },

  { name: 'Tree Table (HOC)', component: CodeSandbox('lxmr4wynzq') },
  { name: 'Select Table (HOC)', component: CodeSandbox('7yq5ylw09j') },
  { name: 'Select Tree Table (HOC)', component: CodeSandbox('2p7jp4klwp') },
  { name: 'Foldable Table (HOC)', component: CodeSandbox('2p7jp4klwp') },
  { name: 'Advanced Expand Table (HOC)', component: CodeSandbox('y2m39jz8v1') },
]

export default class App extends React.Component {
  render() {
    return (
      <ReactStory
        style={{
          display: "block",
          width: "100%",
          height: "100%"
        }}
        pathPrefix="story/"
        StoryWrapper={props => (
          <defaultProps.StoryWrapper
            css={{
              padding: 0,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <a
              href="//github.com/react-tools/react-table"
              style={{
                display: "block",
                textAlign: "center",
                borderBottom: "solid 3px #cccccc"
              }}
            >
              <img
                src="https://github.com/react-tools/media/raw/master/logo-react-table.png"
                alt="React Table Logo"
                style={{
                  width: "150px",
                  padding: "10px"
                }}
              />
            </a>
            <div
              {...props}
              style={{
                flex: "1 0 auto",
                position: "relative"
              }}
            />
          </defaultProps.StoryWrapper>
        )}
        stories={stories}
      />
    );
  }
}
