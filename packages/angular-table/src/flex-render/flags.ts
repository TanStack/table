/**
 * Flags used to manage and optimize the rendering lifecycle of content inside
 * {@link FlexViewRenderer}.
 */
export const FlexRenderFlags = {
  /**
   * The renderer has not completed its initial update. The first update creates
   * the view from scratch, then clears this flag.
   */
  ViewFirstRender: 1 << 0,
  /**
   * The `content` input changed by reference, or its resolved value is not
   * compatible with the mounted view. The next update recreates the view.
   */
  ContentChanged: 1 << 1,
  /**
   * The `props` input changed by reference. Components receive the latest
   * inputs and embedded templates are marked so their getter-backed context is
   * evaluated again.
   */
  PropsReferenceChanged: 1 << 2,
  /**
   * A render function produced compatible content that must be synchronized
   * with the mounted view without recreating it.
   */
  Dirty: 1 << 3,
  /**
   * The render-function effect completed its initial dependency read. That
   * first execution records dependencies; subsequent executions update the
   * view.
   */
  RenderEffectChecked: 1 << 4,
} as const
