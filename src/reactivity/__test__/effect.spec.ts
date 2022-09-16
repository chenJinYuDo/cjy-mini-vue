import { effect, stop, reactive } from '..'

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

// 嵌套的 observe 做出改变时，也会产生响应
it('should observe nested properties', () => {
  let dummy1

  const counter = reactive({ nested: { num: 0 } })
  effect(() => {
    dummy1 = counter.nested.num
  })

  expect(dummy1).toBe(0)
  counter.nested.num = 8
  expect(dummy1).toBe(8)
})

// observer 支持 stop，stop 后支持手动调用
it('stop', () => {
  let dummy
  const obj = reactive({ prop: 1 })
  const runner = effect(() => {
    dummy = obj.prop
  })
  obj.prop = 2
  expect(dummy).toBe(2)
  stop(runner)
  // obj.prop = 3
  obj.prop += 1
  expect(dummy).toBe(2)

  // stopped effect should still be manually callable
  runner()
  expect(dummy).toBe(3)
})

it('stop: a stopped effect is nested in a normal effect', () => {
  let dummy
  const obj = reactive({ prop: 1 })
  const runner = effect(() => {
    dummy = obj.prop
  })
  stop(runner)
  obj.prop = 2
  expect(dummy).toBe(1)

  // observed value in inner stopped effect
  // will track outer effect as an dependency
  effect(() => {
    runner()
  })
  expect(dummy).toBe(2)

  // notify outer effect to run
  obj.prop = 3
  expect(dummy).toBe(3)
})

// 传入参数 scheduler, 支持自定义调度
it('scheduler', () => {
  let dummy
  let run: any
  const scheduler = jest.fn(() => {
    run = runner
  })
  const obj = reactive({ foo: 1 })
  const runner = effect(
    () => {
      dummy = obj.foo
    },
    { scheduler }
  )
  expect(scheduler).not.toHaveBeenCalled()
  expect(dummy).toBe(1)
  // should be called on first trigger
  obj.foo++
  expect(scheduler).toHaveBeenCalledTimes(1)
  // should not run yet
  expect(dummy).toBe(1)
  // manually run
  run()
  // should have run
  expect(dummy).toBe(2)
})

// 支持 stop 回调
it('events: onStop', () => {
  const onStop = jest.fn()
  const runner = effect(() => {}, {
    onStop,
  })

  stop(runner)
  expect(onStop).toHaveBeenCalled()
})

it('should discover new branches while running automatically', () => {
  let dummy
  const obj = reactive({ prop: 'value', run: false })

  const conditionalSpy = jest.fn(() => {
    dummy = obj.run ? obj.prop : 'other'
  })
  effect(conditionalSpy)

  expect(dummy).toBe('other')
  expect(conditionalSpy).toHaveBeenCalledTimes(1)
  obj.prop = 'Hi'
  expect(dummy).toBe('other')
  expect(conditionalSpy).toHaveBeenCalledTimes(1)
  obj.run = true
  expect(dummy).toBe('Hi')
  expect(conditionalSpy).toHaveBeenCalledTimes(2)
  obj.prop = 'World'
  expect(dummy).toBe('World')
  expect(conditionalSpy).toHaveBeenCalledTimes(3)
})

it('should discover new branches when running manually', () => {
  let dummy
  let run = false
  const obj = reactive({ prop: 'value' })
  const runner = effect(() => {
    dummy = run ? obj.prop : 'other'
  })

  expect(dummy).toBe('other')
  runner()
  expect(dummy).toBe('other')
  run = true
  runner()
  expect(dummy).toBe('value')
  obj.prop = 'World'
  expect(dummy).toBe('World')
})

/** FIXME: 4.4 分支切换与clearup **/
it('should not be triggered by mutating a property, which is used in an inactive branch', () => {
  let dummy
  const obj = reactive({ prop: 'value', run: true })

  const conditionalSpy = jest.fn(() => {
    dummy = obj.run ? obj.prop : 'other'
  })
  effect(conditionalSpy)

  expect(dummy).toBe('value')
  expect(conditionalSpy).toHaveBeenCalledTimes(1)
  obj.run = false
  expect(dummy).toBe('other')
  expect(conditionalSpy).toHaveBeenCalledTimes(2)
  obj.prop = 'value2'
  expect(dummy).toBe('other')
  /**
   * 不需要有遗留的副作用
   * 解决思路:
   * 1.在effect实例中收集对其依赖集合的引用
   * 2.当副作用函数执行时候，将副作用函数从集合中移除
   * 3.
   *  const set = new Set([1])
   *  set.forEach(item => {
   *    set.delete(1)
   *    set.add(1)
   *    //这里会导致死循环
   *  })
   *
   */
  expect(conditionalSpy).toHaveBeenCalledTimes(2)
})

/** 4.5 嵌套的effect 与 effect栈 */
/**
 * activeEffect 在一个effect作用域只保存一个
 * 由于嵌套的effect会覆盖activeEffect的值，所以会导致其错乱
 *
 */
it('should allow nested effects', () => {
  const nums = reactive({ num1: 0, num2: 1, num3: 2 })
  const dummy: any = {}

  const childSpy = jest.fn(() => (dummy.num1 = nums.num1))
  const childeffect = effect(childSpy)
  const parentSpy = jest.fn(() => {
    dummy.num2 = nums.num2
    childeffect()
    dummy.num3 = nums.num3
  })
  effect(parentSpy)

  expect(dummy).toEqual({ num1: 0, num2: 1, num3: 2 })
  expect(parentSpy).toHaveBeenCalledTimes(1)
  expect(childSpy).toHaveBeenCalledTimes(2)
  // this should only call the childeffect
  nums.num1 = 4
  expect(dummy).toEqual({ num1: 4, num2: 1, num3: 2 })
  expect(parentSpy).toHaveBeenCalledTimes(1)
  expect(childSpy).toHaveBeenCalledTimes(3)
  // this calls the parenteffect, which calls the childeffect once
  nums.num2 = 10
  expect(dummy).toEqual({ num1: 4, num2: 10, num3: 2 })
  expect(parentSpy).toHaveBeenCalledTimes(2)
  expect(childSpy).toHaveBeenCalledTimes(4)
  // this calls the parenteffect, which calls the childeffect once
  nums.num3 = 7
  expect(dummy).toEqual({ num1: 4, num2: 10, num3: 7 })
  expect(parentSpy).toHaveBeenCalledTimes(3)
  expect(childSpy).toHaveBeenCalledTimes(5)
})
