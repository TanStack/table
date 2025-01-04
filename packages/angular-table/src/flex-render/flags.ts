export enum FlexRenderFlags {
  /**
   * Whether the view has been created.
   */
  Creation = 1 << 0,
  /**
   * Whether the `content` property has changed.
   * When this flag is enabled, the view is recreated from scratch after clearing the previous one.
   */
  ContentChanged = 1 << 1,
  /**
   * Whether the `props` property has changed.
   * When this flag is enabled, the view context is updated based on the type of the content:
   * - Component view: inputs will be updated and view will be marked as dirty
   * - TemplateRef | primitive values: view will be marked as dirty
   */
  PropsReferenceChanged = 1 << 2,
  /**
   * Whether the current rendered view has to be dirty checked.
   * When this flag is enabled, the view will be updated based on it's type.
   */
  DirtyCheck = 1 << 3,
}
