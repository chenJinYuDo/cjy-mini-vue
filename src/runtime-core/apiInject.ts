import { getCurrentInstance } from "./component";
/** 只能在setup函数内调用 */ 
export function provider(key:any, value:any){
  // 存
  /** 1.在setup函数里面获取instance */
  const currentInstance = getCurrentInstance();

  /** 存入数据 */ 
  if(currentInstance){
    
    let { providers, parent } = currentInstance;
    /** 初始化 **/
    if(parent && providers === parent.providers){
      /**
       * Object.create 返回一个新的对象引用
       * 
       * 浅复制情况是 provides.xxx 会改变 currentInstance.providers 的值 
       * 
       * 但是 provides 在赋值了新的引用后就不会了
      */
      providers = currentInstance.providers =  Object.create(parent.providers);
    }
    providers[key] = value;
  }

}


export function inject(key:any){
  // 取
   /** 1.在setup函数里面获取instance */
   const currentInstance = getCurrentInstance();
   if(currentInstance){
    const { parent } = currentInstance;
    return parent.providers[key];
   }
}