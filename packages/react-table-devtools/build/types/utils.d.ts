import React from 'react';
import { Theme } from './theme';
export declare const isServer: boolean;
declare type StyledComponent<T> = T extends 'button' ? React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> : T extends 'input' ? React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> : T extends 'select' ? React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> : T extends keyof HTMLElementTagNameMap ? React.HTMLAttributes<HTMLElementTagNameMap[T]> : never;
declare type Styles = React.CSSProperties | ((props: Record<string, any>, theme: Theme) => React.CSSProperties);
export declare function styled<T extends keyof HTMLElementTagNameMap>(type: T, newStyles: Styles, queries?: Record<string, Styles>): React.ForwardRefExoticComponent<React.PropsWithoutRef<StyledComponent<T>> & React.RefAttributes<HTMLElementTagNameMap[T]>>;
export declare function useIsMounted(): () => boolean;
/**
 * This hook is a safe useState version which schedules state updates in microtasks
 * to prevent updating a component state while React is rendering different components
 * or when the component is not mounted anymore.
 */
export declare function useSafeState<T>(initialState: T): [T, (value: T) => void];
export {};
