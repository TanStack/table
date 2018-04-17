/* eslint-disable  */
import React from "react";
import marked from "marked";
//
import HOCReadme from "!raw!../../../src/hoc/README.md";
import "github-markdown-css/github-markdown.css";
import "./utils/prism.js";

export default class HOCStory extends React.Component {
  render() {
    return (
      <div style={{ padding: "10px" }}>
        <span
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: marked(HOCReadme) }}
        />
      </div>
    );
  }
  componentDidMount() {
    global.Prism && global.Prism.highlightAll();
  }
}
