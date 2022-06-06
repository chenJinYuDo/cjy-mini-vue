import { mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export enum ReactiveFlag {
  'v__isReactive' = 'v__isReactive',
  'v__isReadonly' = 'v__isReadonly'
}


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


export function isReactive(ref:any) {
  return !!ref[ReactiveFlag.v__isReactive]
}

export function isReadonly(ref:any) {
  return !!ref[ReactiveFlag.v__isReadonly]
}

export function isProxy(ref:any){
  return isReactive(ref) || isReadonly(ref);
}








