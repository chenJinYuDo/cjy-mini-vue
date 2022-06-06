import { createComponentInstance, setupComponent } from "./component"
import { createVNode } from "./vnode";

export function render(vnode:any, container:any){
  patch(vnode, container)
}

/** patch函数递归关键 */
function patch(vnode:any, container:any){
  /**
   * 检查vnode节点类型
   * 如果是组件
   *  xxx
   * 如果是元素
   *  xxx
   * */ 
   processComponent(vnode, container)
}

/** 创建组件过程 */ 
function processComponent(vnode:any, container:any) {
  mountComponent(vnode, container)
}
function mountComponent(vnode:any, container:any) {
  // 创建组件实例
  const instance = createComponentInstance(vnode);

  // 调用关于组件setup的事情
  setupComponent(instance)

  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();

  patch(subTree, container)
}


