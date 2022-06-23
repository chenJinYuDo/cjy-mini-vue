import { isObject } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function createVNode(type:any, props?:any, children?:any){
  const vnode =  {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el:null
  }

  // if(type === 'fragment'){
  //   vnode.shapeFlag |= ShapeFlags.FRAGMENT
  // }

  if(typeof children === 'string'){ 
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }else if(Array.isArray(children)){
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 当vnode是组件 且 children 是对象 就是插槽
  if((vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT)  && isObject(children)){
    vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
  }

  return vnode;
}

export function createTextVNode(text:string){
  return createVNode(Text, null, text)
}

/** 组件 或者 element */ 
function getShapeFlag(type:any){
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
