/** Solid's intrinsic element types intentionally omit open-ended data-* keys. */
export type WithDataAttributes<Attributes> = Attributes & {
  [attribute: `data-${string}`]: string | number | boolean | undefined
}
