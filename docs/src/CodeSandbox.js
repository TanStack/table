import React from "react";

export const CodeSandbox = name => () => {
  return (
    <iframe
	  src={`https://codesandbox.io/embed/github/tannerlinsley/react-table/tree/v6/examples/${name}?autoresize=1&hidenavigation=1&view=${
        global.innerWidth < 1000 ? "preview" : "split"
      }`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `100%`,
        height: `100%`,
        border: 0,
        overflow: `hidden`
      }}
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    />
  );
};

export const CodeSandboxId = id => () => {
  return (
    <iframe
	  src={`https://codesandbox.io/embed/${id}?autoresize=1&hidenavigation=1&view=${
        global.innerWidth < 1000 ? "preview" : "split"
      }`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `100%`,
        height: `100%`,
        border: 0,
        overflow: `hidden`
      }}
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    />
  );
};
