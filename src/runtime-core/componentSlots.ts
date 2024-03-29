import { ShapeFlags } from "../shared/shapeFlags";

export function initSlots(instance:any, children:any){
  const { vnode } = instance;
  if(vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN){
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots(children:any, slots:any){
  for (const key in children) {
    const solt = children[key];
    slots[key] = (ctx:any) => normalizeSlotValue(solt(ctx))
  }
}

function normalizeSlotValue(value:any){
  return Array.isArray(value) ? value : [value]
}