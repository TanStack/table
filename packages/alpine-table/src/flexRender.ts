export function flexRender<TProps extends object>(render: any, props: TProps): any {
  if (typeof render === 'function') {
    return render(props)
  }
  return render
}
