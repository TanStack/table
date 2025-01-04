export enum FlexRenderFlags {
  /**
   * Whether the view has not been created yet or the current view will be cleared during the update phase.
   */
  Creation = 1 << 0,
  /**
   * Whether the `content` property has changed or the view need a complete re-rendering.
   * When this flag is enabled, the view is recreated from scratch after clearing the previous one.
   */
  ContentChanged = 1 << 1,
  /**
   * Whether the `props` property reference has changed.
   * When this flag is enabled, the view context is updated based on the type of the content.
   *
   * For Component view, inputs will be updated and view will be marked as dirty.
   * For TemplateRef and primitive values, view will be marked as dirty
   */
  PropsReferenceChanged = 1 << 2,
  /**
   * Whether the current rendered view has to be dirty checked.
   */
  DirtyCheck = 1 << 3,
}
