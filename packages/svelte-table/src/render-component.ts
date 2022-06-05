import {
  SvelteComponent,
  claim_component,
  create_component,
  destroy_component,
  init,
  mount_component,
  noop,
  safe_not_equal,
  transition_in,
  transition_out,
  create_ssr_component,
  validate_component,
} from 'svelte/internal'

function create_fragment(ctx: any, Comp: any, props: any) {
  let c: any
  let current: any
  c = new Comp({ props, $$inline: true })

  return {
    c() {
      create_component(c.$$.fragment)
    },
    l(nodes: any) {
      claim_component(c.$$.fragment, nodes)
    },
    m(target: any, anchor: any) {
      // @ts-ignore
      mount_component(c, target, anchor)
      current = true
    },
    p: noop,
    i(local: any) {
      if (current) return
      transition_in(c.$$.fragment, local)
      current = true
    },
    o(local: any) {
      transition_out(c.$$.fragment, local)
      current = false
    },
    d(detaching: any) {
      destroy_component(c, detaching)
    },
  }
}

function renderClient(Comp: any, props: any): any {
  return class WrapperComp extends SvelteComponent {
    constructor(options: any) {
      super()
      init(
        this,
        options,
        null,
        (ctx: any) => create_fragment(ctx, Comp, props),
        safe_not_equal,
        {},
        undefined
      )
    }
  }
}

function renderServer(Comp: any, props: any) {
  const WrapperComp = create_ssr_component(
    ($$result: any, $$props: any, $$bindings: any, slots: any) => {
      return `${validate_component(Comp, 'TableComponent').$$render(
        $$result,
        props,
        {},
        {}
      )}`
    }
  )

  return WrapperComp
}

export const renderComponent =
  typeof window === 'undefined' ? renderServer : renderClient
