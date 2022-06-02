import { tarck, trigger } from "./effect";

export function reactive<T extends object>(raw:T) {
  return new Proxy(raw, {
    get:(target, key) => {
      tarck(target,key);
      return Reflect.get(target, key);
    },
    set:(target, key, value) => {
      const result = Reflect.set(target, key, value);
      trigger(target, key)
      return result
    }
  })
}