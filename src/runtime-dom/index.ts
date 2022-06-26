import { createRenderer } from "../runtime-core";
import { isEvent } from "../shared";
export * from '../runtime-core';

function createElement(type:string){
  return document.createElement(type);
}


function patchProp(el:any, key:string, value:any){
  if (isEvent(key)) {
    el.addEventListener(key.slice(2).toLocaleLowerCase(), value);
  } else {
    el.setAttribute(key, value);
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

