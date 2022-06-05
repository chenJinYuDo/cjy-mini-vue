// 提取handlers 成一个文件
import { tarck, trigger } from "./effect"
import { reactive, readonly } from "./reactive"

// 缓存 get set
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(false)
const shallowReactiveGet = createGetter(true, true)
const shallowReadonlyGet = createGetter(false, true)

const  extend = (target:any, source:any) => Object.assign(target, source)

const isObject:(object:any)=> boolean = (raw:any) => {
  return typeof raw !== null && typeof raw === 'object'
}

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


export const mutableHandlers = {
  get,
  set 
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: (target: any, key: any, value: any) => {
    // throw(new Error(`${target}${String(key)} is readonly , can't be set ${value}`));
    console.warn(`${target}${String(key)} is readonly , can't be set ${value}`)
    return true
  }
}

export const shallowReactiveHandlers = {
  get:shallowReactiveGet,
  set
}

export const shallowReadonlyHandlers = extend(readonlyHandlers , {
  get: shallowReadonlyGet
})