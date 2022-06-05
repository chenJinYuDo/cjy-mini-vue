import { effect,stop } from "./effect"

// 支持 stop 回调
it('events: onStop', () => {
  const onStop = jest.fn()
  const runner = effect(() => {}, {
    onStop
  })

  stop(runner)
  expect(onStop).toHaveBeenCalled()
})