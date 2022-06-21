import { createVNode } from "../vnode";

export function renderSlots(slots:any, name:string, ctx:any){
  const slot = slots[name]
  if(slot){
    if(typeof slot === "function"){
      return createVNode('div', {} , slot(ctx));
    }
  }
}