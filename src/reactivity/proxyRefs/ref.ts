import { ReactiveEffect, tarckEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  refFlag = true;
  private _value: any;
  private _rawValue:any;
  private _dep:Set<ReactiveEffect> = new Set();
  constructor(value:any){
    this._rawValue = value;
    this._value = conver(value);
  }

  get value(){
    // 收集依赖
    tarckEffect(this._dep);
    return this._value
  }

  set value(value){
    if(hasChanged(value, this._rawValue)){
      this._rawValue = value
      this._value = conver(value);
      // 触发依赖
      triggerEffect(this._dep);
    }
  }
}

export function isRef(ref:RefImpl | any){
  return !!ref.refFlag
}

export function unRef(ref:any){
  return isRef(ref) ? ref.value : ref
}

export function ref(value:any){

  return new RefImpl(value);
}


export function proxyRefs(target:any) {
  return new Proxy(target, {
    get(target, key){
      const result = Reflect.get(target, key);
      if(isRef(result)){
        return (result as RefImpl).value
      }
      return result
    },
    set(target, key, newValue){
      const oldValue = Reflect.get(target, key);
      if(isRef(oldValue) && !isRef(newValue)){
        (oldValue as RefImpl).value = newValue
        return true;
      }
      return Reflect.set(target, key, newValue)
    }
  })
}


function conver(value:any){
  return isObject(value) ? reactive(value) : value
}

function hasChanged(newVal:any , oldVal:any) {
  return !Object.is(newVal, oldVal)
}



function isObject(target:any) {
  return typeof target !== null && typeof target === 'object';
}