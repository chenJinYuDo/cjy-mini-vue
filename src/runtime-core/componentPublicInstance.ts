import { hasOwn } from "../shared";

const publicPropertiesMap:{[key:string]:any} = {
  $el:(i:any) => i.vnode.el,
  $slots:(i:any) => i.slots
}


export const PublicInstanceProxyHandlers = {
  get({_: instance}:any, key:any){
    const { setupStatus, props } = instance;
    /** 当key 在setupStatus时候，返回setupStatus[key] */
    /** key in object 这个抽取成公共函数 */
    // key in setupStatus
    if(hasOwn(key, setupStatus)){
      return setupStatus[key];
    }else if(hasOwn(key, props)){
      return props[key]
    }
    const publicGetter = publicPropertiesMap[key];
    if(publicGetter){
      return publicGetter(instance);
    }
  }
}