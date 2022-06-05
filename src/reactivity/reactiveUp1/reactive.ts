import { tarck, trigger } from "./effect";

const  extend = (target:any, source:any) => Object.assign(target, source)

const isObject:(object:any)=> boolean = (raw:any) => {
  return typeof raw !== null && typeof raw === 'object'
}

export function reactive<T extends object>(raw:T):any {
  return new Proxy(raw, mutableHandlers)
}

// 实现readonly 、shallowReactive、shallowReadonly
export function readonly<T extends object>(raw:T):any {
  return new Proxy(raw, readonlyHandlers)
}

// 浅的reactive
export function shallowReactive<T extends object>(raw:T):any{
  return new Proxy(raw, shallowReactiveHandlers)
}

// 浅的readonly
export function shallowReadonly<T extends object>(raw:T):any {
    return new Proxy(raw, shallowReadonlyHandlers)
}


// 1.优化 提取出 getter 和 setter 函数
// 2.添加参数区分 是否深浅 和 是否响应
function createGetter(isReactive = true, isShallow = false) {
  return (target: object, key: PropertyKey) => {
    const result = Reflect.get(target, key)
    if(!isShallow && isObject(result)){
      return isReactive ? reactive(result) : readonly(result)
    }
    tarck(target,key);
    return result;
  }
}

function createSetter() {
  return (target: object, key: any, value: any) => {
    const result = Reflect.set(target, key, value);
    trigger(target, key)
    return result
  }
}


// 3.提取handler
const mutableHandlers = {
  get: createGetter(),
  set: createSetter()
}

const readonlyHandlers = {
  get: createGetter(false),
  set: (target: any, key: any, value: any) => {
    // throw(new Error(`${target}${String(key)} is readonly , can't be set ${value}`));
    console.warn(`${target}${String(key)} is readonly , can't be set ${value}`)
    return true
  }
}

const shallowReactiveHandlers = {
  get: createGetter(true, true),
  set: createSetter()
}

const shallowReadonlyHandlers = extend(readonlyHandlers , {
  get: createGetter(false, true)
})


