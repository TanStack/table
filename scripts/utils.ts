export function getPackageDir(packageName: string) {
  return packageName
    .split('/')
    .filter((d) => !d.startsWith('@'))
    .join('/')
}
