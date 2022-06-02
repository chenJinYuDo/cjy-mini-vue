import { tarck, trigger } from "./effect";

const isObject:(object:any)=> boolean = (raw:any) => {
  return typeof raw !== null && typeof raw === 'object'
}

export function reactive<T extends object>(raw:T):any {
  return new Proxy(raw, {
    get:(target, key) => {
      const result = Reflect.get(target, key)

      if(isObject(result)){
        return reactive(result)
      }

      tarck(target,key);
      return result;
    },
    set:(target, key, value) => {
      const result = Reflect.set(target, key, value);
      trigger(target, key)
      return result
    }
  })
}