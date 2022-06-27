import { createRenderer } from "../runtime-core";
import { isEvent } from "../shared";
export * from '../runtime-core';

function createElement(type:string){
  return document.createElement(type);
}


function patchProp(el:any, key:string, prevVal:any, nextVal:any){
  if (isEvent(key)) {
    el.addEventListener(key.slice(2).toLocaleLowerCase(), nextVal);
  } else {
    if(nextVal === undefined || nextVal === null){
      el.removeAttribute(key)
    }else{
      el.setAttribute(key, nextVal);
    }
  }
}

function insert(el:any, container:any){
  container.append(el);
}

const renderer:any = createRenderer({
  createElement,
  patchProp,
  insert
})

export function createApp(...args: any){
  return renderer.createApp(...args);
}

