
const publicPropertiesMap:{[key:string]:any} = {
  $el:(i:any) => i.vnode.el
}


export const PublicInstanceProxyHandlers = {
  get({_: instance}:any, key:any){
    const { setupStatus  } = instance;
    /** 当key 在setupStatus时候，返回setupStatus[key] */
    if(key in setupStatus){
      return setupStatus[key];
    }
    
    const publicGetter = publicPropertiesMap[key];
    publicGetter && publicGetter(instance);

  }
}