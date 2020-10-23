type DefaultOptions = {}
type DefaultInstance = {
  options: unknown
}

type ApiExtension = { [key: string]: any }
export type BasePlugin<Instance = any, Options = any> = (
  instance: Instance,
  options: Options
) => ApiExtension | undefined

type UnionToIntersection<Union> = (Union extends any
? (argument: Union) => void
: never) extends (argument: infer Intersection) => void
  ? Intersection
  : never

export type Base<TOptions, TInstance> = (options: TOptions) => TInstance

type ExtractPluginArrayOptions<
  TPlugins extends BasePlugin[]
> = UnionToIntersection<Parameters<TPlugins[number]>[1]>
type ExtractPluginArrayInstance<
  TPlugins extends BasePlugin[]
> = UnionToIntersection<ReturnType<TPlugins[number]>>

export const makeBase = <
  TOptions = DefaultOptions,
  TInstance = DefaultInstance,
  TPlugins extends BasePlugin[] = BasePlugin[]
>({
  plugins,
}: {
  plugins: TPlugins
}): Base<
  TOptions & ExtractPluginArrayOptions<TPlugins>,
  TInstance & ExtractPluginArrayInstance<TPlugins>
> => {
  return options => {
    const instance: DefaultInstance = {
      options,
    }

    plugins.forEach(plugin => {
      Object.assign(instance, plugin(instance as any, options))
    })

    return instance as TInstance & ExtractPluginArrayInstance<TPlugins>
  }
}

//

interface FooOptions extends DefaultOptions {
  fooValue: string
}

function myFooPlugin(_instance: DefaultInstance, options: FooOptions) {
  return {
    foo: () => options.fooValue,
  }
}

interface BarOptions extends DefaultOptions {
  fooValue: string
  barValue: string
}

function myBarPlugin(_instance: DefaultInstance, options: BarOptions) {
  return {
    bar: () => options.fooValue ?? '' + options.barValue ?? '',
  }
}

interface BazOptions extends FooOptions, BarOptions {
  fooValue: string
  barValue: string
  bazValue: string
}

function myBazPlugin(_instance: DefaultInstance, options: BazOptions) {
  return {
    baz: () => options.fooValue + options.barValue + options.bazValue,
  }
}

//

const withFooBarBaz1 = makeBase({
  plugins: [myFooPlugin, myBarPlugin, myBazPlugin],
})

const fooBarBaz = withFooBarBaz1({
  fooValue: 'foo',
  barValue: 'bar',
  bazValue: 'baz',
})

console.log(fooBarBaz.baz())
