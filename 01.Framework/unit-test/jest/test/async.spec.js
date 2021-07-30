const fetch = require('../src/async')

test('test promise then', () => {
  // * return
  return fetch().then(res => {
    expect(res).toBe('fulfilled')
  })
})

test('test promise resolves', () => {
  // * return
  return expect(fetch()).resolves.toBe('fulfilled')
})

test('test Async/Await', async () => {
  const res = await fetch()
  expect(res).toBe('fulfilled')
})
test('test Async/Await .resolves', async () => {
  // * no return
  await expect(fetch()).resolves.toBe('fulfilled')
})

