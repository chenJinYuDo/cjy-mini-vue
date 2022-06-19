import { shallowReadonly } from "../reactivity";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

/** 创建组件实例
 * @return instance
 *  */
export function createComponentInstance(vnode: any) {
  const instance = {
    vnode,
    type: vnode.type,
    setupStatus: {},
    props:{},
    proxy: null,
    el:null
  };
  return instance;
}

export function setupComponent(instance: any) {
  // TODO:initProps 初始化属性
  // TODO:initSlots 初始化插槽
  initProps(instance, instance.vnode.props);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const component = instance.type,
    { setup } = component,
    { props } = instance;

  // ctx
  instance.proxy = new Proxy({_:instance},PublicInstanceProxyHandlers);

  if (setup) {
    const setupResult = setup(shallowReadonly(props));

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
