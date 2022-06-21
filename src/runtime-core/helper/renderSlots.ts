import { createVNode } from "../vnode";

export function renderSlots(slots:any, slotName:string){
  if(slotName && slots[slotName]){
    return createVNode('div', {} , slots[slotName]);
  }
  return createVNode('div', {} , slots);
}