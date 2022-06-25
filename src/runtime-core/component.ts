import { shallowReadonly } from "../reactivity";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

let currentInstance: any = null;
 /** 创建组件实例
 * @return instance
 *  */
export function createComponentInstance(vnode: any, parent:any) {
  const instance = {
    vnode,
    type: vnode.type,
    setupStatus: {},
    props:{},
    proxy: null,
    slots:{},
    el:null,
    providers:{}, /** 存储provider们 */
    parent,
    emit:()=>{}
  };

  instance.emit = emit.bind(null, instance) as any

  return instance;
}

export function setupComponent(instance: any) {
  // TODO:initSlots 初始化插槽
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const component = instance.type,
    { setup } = component,
    { props, emit} = instance;

  // ctx
  instance.proxy = new Proxy({_:instance},PublicInstanceProxyHandlers);

  if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(props), { emit });
    setCurrentInstance(null)
    handleSetupResult(instance, setupResult);
  }

  finishComponentSetup(instance);
}

function handleSetupResult(instance: any, setupResult: any) {
  if(setupResult){
    instance.setupStatus = setupResult;
  }
}

function finishComponentSetup(instance: any) {
  const render = instance.vnode.type.render;
  if (render) {
    instance.render = render;
  }
}

export function getCurrentInstance(){
  return currentInstance
}

function setCurrentInstance(instance:any){
  currentInstance = instance
}
