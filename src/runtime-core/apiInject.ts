import { getCurrentInstance } from "./component";
/** 只能在setup函数内调用 */ 
export function provider(key:any, value:any){
  // 存
  /** 1.在setup函数里面获取instance */
  const currentInstance = getCurrentInstance();

  /** 存入数据 */ 
  if(currentInstance){
    const { providers } = currentInstance;
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