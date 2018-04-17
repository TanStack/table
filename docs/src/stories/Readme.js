/* eslint-disable import/no-webpack-loader-syntax */
import React from "react";
import marked from "marked";
//
import Readme from "!raw!../../../README.md";
import "github-markdown-css/github-markdown.css";
import "./utils/prism.js";

export default class Story extends React.Component {
  render() {
    return (
      <div style={{ padding: "10px" }}>
        <span
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: marked(Readme) }}
        />
      </div>
    );
  }
  componentDidMount() {
    global.Prism && global.Prism.highlightAll();
  }
}
