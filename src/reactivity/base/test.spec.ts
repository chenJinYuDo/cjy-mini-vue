import { effect } from "./effect"
import { reactive } from "./reactive"

test('Object', () => {
  const original = { foo: 1 }
  const observed = reactive(original)
  expect(observed).not.toBe(original)
  // expect(isReactive(observed)).toBe(true)
  // expect(isReactive(original)).toBe(false)
  // get
  expect(observed.foo).toBe(1)
  // has
  expect('foo' in observed).toBe(true)
  // ownKeys
  expect(Object.keys(observed)).toEqual(['foo'])
})


// 传递给effect的方法，会立即执行一次
it('should run the passed function once (wrapped by a effect)', () => {
  const fnSpy = jest.fn(() => {})
  effect(fnSpy)
  expect(fnSpy).toHaveBeenCalledTimes(1)
})


// 在 effect 执行将 observe 对基本类型赋值，observe 进行改变时，将反应到基本类型上
it('should observe basic properties', () => {
  let dummy 
  const counter = reactive({ num: 0 })
  effect(() => (dummy = counter.num))

  expect(dummy).toBe(0)
  counter.num = 7
  expect(dummy).toBe(7)
})

// 同上，不过我们从这个单测就能看出来effect 中是有 cache 存在的
it('should observe multiple properties', () => {
  let dummy
  const counter = reactive({ num1: 0, num2: 0 })
  effect(() => (dummy = counter.num1 + counter.num1 + counter.num2))

  expect(dummy).toBe(0)
  counter.num1 = counter.num2 = 7     
  expect(dummy).toBe(21)
})

// 在多个 effect 中处理 observe，当 observe 发生改变时，将同步到多个 effect
it('should handle multiple effects', () => {
  let dummy1, dummy2
  const counter = reactive({ num: 0 })
  effect(() => (dummy1 = counter.num))
  effect(() => (dummy2 = counter.num))

  expect(dummy1).toBe(0)
  expect(dummy2).toBe(0)
  counter.num++
  expect(dummy1).toBe(1)
  expect(dummy2).toBe(1)
})