import {TablePlugin} from "../hooks/pluginSupport";
import { makeRenderer } from "../utils";

export const withRenderSupport: TablePlugin = {
    name: "withRenderSupport",
    decorateCell: (cell, meta) => {
        // @ts-ignore
        cell.Renderer = (userProps) => {
            return makeRenderer(meta.getInstance)
                ('Cell', {
                    ...cell,
                    ...userProps
                })
        }
    },
}