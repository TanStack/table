import React from "react";
import {TableColumn, TablePlugin} from "../hooks/pluginSupport";
import { isReactComponent, getFirstDefined } from "../utils";

export const withRenderSupport: TablePlugin = {
    name: "withRenderSupport",
    decorateCell: (cell, meta) => {
      const Component = getFirstDefined(
        cell.column.Cell,
        simpleCellRenderer,
      );

      let Renderer: (props: object) => any;
      if (isReactComponent(Component)) {
        if (typeof Component === "function") {
          // allow functional components to be inlined
          Renderer = (userProps: object) => Component({
            tableInstance: meta.getInstance(),
            ...cell,
            ...userProps,
          })
        } else {
          Renderer = (userProps) => <Component tableInstance={meta.getInstance()} {...cell} {...userProps} />
        }
      } else {
        Renderer = () => Component
      }
      cell.Renderer = Renderer;
    },
    decorateHeader: (cell, meta) => {
        if (cell.column === undefined) return;
        const Component = getFirstDefined(
           cell.column.Header,
           simpleHeaderRenderer,
        );

        let Renderer: (props: object) => any;
        if (isReactComponent(Component)) {
          if (typeof Component === "function") {
            // allow functional components to be inlined
            Renderer = (userProps: object) => Component({
              tableInstance: meta.getInstance(),
              ...cell.column,
              ...userProps,
            })
          } else {
            Renderer = (userProps) => <Component tableInstance={meta.getInstance()} {...cell} {...userProps} />
          }
        } else {
           Renderer = () => Component
        }
        cell.Renderer = Renderer;
    }
}

function simpleHeaderRenderer(props: TableColumn) {
  return props.id;
}

const simpleCellRenderer= ({ value = '' }: {value: any}) => typeof value === 'boolean' ? value.toString() : value
