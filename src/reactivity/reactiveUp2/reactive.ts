import { mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from "./baseHandlers";


export function reactive<T extends object>(raw:T):any {
  return createActiveObject(raw, mutableHandlers)
}

// 实现readonly 、shallowReactive、shallowReadonly
export function readonly<T extends object>(raw:T):any {
  return createActiveObject(raw, readonlyHandlers)
}

// 浅的reactive
export function shallowReactive<T extends object>(raw:T):any{
  return createActiveObject(raw, shallowReactiveHandlers)
}

// 浅的readonly
export function shallowReadonly<T extends object>(raw:T):any {
    return createActiveObject(raw, shallowReadonlyHandlers)
}

function createActiveObject<T extends object>(raw:T, handlers:any){
  return new Proxy(raw, handlers)
}








