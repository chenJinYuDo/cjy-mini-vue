import { camelize, toHandlerKey } from "../shared";

export function emit(instance: any, emitEve: string, ...args: any[]) {
  const { props } = instance,
    handerName = toHandlerKey(camelize(emitEve)),
    hander = props[handerName];
    /** add-foo ==> addFoo */

    hander && hander(...args);
}


