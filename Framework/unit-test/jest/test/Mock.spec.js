function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

// jest.fn
const mockCallback = jest.fn(x => 42 + x);

// mock 函数 一共执行了2遍
forEach([0, 1], mockCallback);

test('test Mock', () => {
  // expect
  // console.log(mockCallback.mock.calls) // [ [ 0 ], [ 1 ] ]
  // console.log(mockCallback.mock.results) // [ { type: 'return', value: 42 }, { type: 'return', value: 43 } ]
  expect(mockCallback.mock.calls.length).toBe(2)
  expect(mockCallback.mock.calls[0][0]).toBe(0)
  expect(mockCallback.mock.calls[1][0]).toBe(1)
  expect(mockCallback.mock.calls[1][1]).toBeUndefined()
  expect(mockCallback.mock.results[0].value).toBe(42)
  expect(mockCallback.mock.results[1].value).toBe(43)

  // instance ?
  const mock = mockCallback.mock
  const ins = new mockCallback()
  // console.log(mock.instances)

  // 返回值
  const myMock = jest.fn();
console.log(myMock());
// > undefined
myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);
console.log(myMock(), myMock(), myMock(), myMock());
})



