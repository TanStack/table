export type TableWorker = typeof test

export const test = {
  sync: () => {
    console.info('sync')
  },
  async: async () => {
    await new Promise(r => setTimeout(r, 1000))
    console.info('hello')
  },
}

addEventListener('message', e => {
  console.info(e.data)
})
