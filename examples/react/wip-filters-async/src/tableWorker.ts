export type TableWorker = typeof test

export const test = {
  sync: () => {
    console.log('sync')
  },
  async: async () => {
    await new Promise(r => setTimeout(r, 1000))
    console.log('hello')
  },
}

addEventListener('message', e => {
  console.log(e.data)
})
