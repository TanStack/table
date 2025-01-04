export enum FlexRenderFlags {
  /**
   * Whether the view has not been created yet or the current view will be cleared during the update phase.
   */
  Creation = 1 << 0,
  /**
   * Whether the view is not dirty.
   */
  Pristine = 1 << 1,
  /**
   * Indicates that the `content` property has changed or the view need a complete re-rendering.
   * When this flag is enabled, the view is recreated from scratch after clearing the previous one.
   */
  ContentChanged = 1 << 2,
  /**
   * Indicates that the `props` property reference has changed.
   * When this flag is enabled, the view context is updated based on the type of the content.
   *
   * For Component view, inputs will be updated and view will be marked as dirty.
   * For TemplateRef and primitive values, view will be marked as dirty
   */
  PropsReferenceChanged = 1 << 3,
  /**
   * Indicates the current rendered view has to be dirty checked.
   */
  DirtyCheck = 1 << 4,
}
