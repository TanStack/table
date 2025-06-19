import React from 'react';
interface DevtoolsOptions {
    /**
     * The react table instance to attach the devtools to.
     */
    instance: any;
    /**
     * Set this true if you want the dev tools to default to being open
     */
    initialIsOpen?: boolean;
    /**
     * Use this to add props to the panel. For example, you can add className, style (merge and override default style), etc.
     */
    panelProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    /**
     * Use this to add props to the close button. For example, you can add className, style (merge and override default style), onClick (extend default handler), etc.
     */
    closeButtonProps?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    /**
     * Use this to add props to the toggle button. For example, you can add className, style (merge and override default style), onClick (extend default handler), etc.
     */
    toggleButtonProps?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    /**
     * Use this to render the devtools inside a different type of container element for a11y purposes.
     * Any string which corresponds to a valid intrinsic JSX element is allowed.
     * Defaults to 'footer'.
     */
    containerElement?: string | any;
}
interface DevtoolsPanelOptions {
    /**
     * The react table instance to attach the devtools to.
     */
    instance: any;
    /**
     * The standard React style object used to style a component with inline styles
     */
    style?: React.CSSProperties;
    /**
     * The standard React className property used to style a component with classes
     */
    className?: string;
    /**
     * A boolean variable indicating whether the panel is open or closed
     */
    isOpen?: boolean;
    /**
     * A function that toggles the open and close state of the panel
     */
    setIsOpen: (isOpen: boolean) => void;
}
export declare function ReactTableDevtools({ initialIsOpen, instance, panelProps, toggleButtonProps, containerElement: Container, }: DevtoolsOptions): React.ReactElement | null;
export declare const ReactTableDevtoolsPanel: React.ForwardRefExoticComponent<DevtoolsPanelOptions & React.RefAttributes<HTMLDivElement>>;
export {};
