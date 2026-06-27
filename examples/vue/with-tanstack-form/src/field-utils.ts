export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object' && 'message' in error) {
    const message = error.message
    if (typeof message === 'string') return message
  }

  return String(error)
}

export function shouldShowErrors(meta: {
  isBlurred: boolean
  isTouched: boolean
  errors: ReadonlyArray<unknown>
}) {
  return (meta.isTouched || meta.isBlurred) && meta.errors.length > 0
}
