import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options:any){
  const {
    createElement, /** 创建元素的接口 */
    patchProp,/** 绑定属性的接口 */
    insert /** 插入元素的接口 */
  } = options

  function render(vnode: any, container: any) {
    patch(vnode, container, null);
  }
  
  /** patch函数递归关键 */
  function patch(vnode: any, container: any, parentComponent:any) {
    /**
     * 检查vnode节点类型
     * 如果是组件
     *  xxx
     * 如果是元素
     *  xxx
     * */
    // debugger
    const { type } = vnode;
  
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        const { shapeFlag } = vnode;
  
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理element
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(vnode, container, parentComponent);
        }
        break;
    }
  }
  
  function processFragment(vnode: any, container: any, parentComponent:any) {
    const { children } = vnode;
    mountChilden(children, container, parentComponent);
  }
  
  function processText(vnode: any, container: any){
   const el = (vnode.el = document.createTextNode(vnode.children));
   container.append(el);
  }
  
  /** 创建组件过程 */
  function processComponent(vnode: any, container: any, parentComponent:any) {
    mountComponent(vnode, container, parentComponent);
  }
  function mountComponent(initalVNode: any, container: any, parentComponent:any) {
    // 创建组件实例
    const instance = createComponentInstance(initalVNode, parentComponent);
  
    // 调用关于组件setup的事情
    setupComponent(instance);
  
    setupRenderEffect(instance, initalVNode, container);
  }
  
  function setupRenderEffect(instance: any, initalVNode: any, container: any) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container, instance);
  
    // 关键点在patch Element完成之后，component 的 虚拟节点才能访问el
    initalVNode.el = subTree.el;
  }
  
  function processElement(vnode: any, container: any, parentComponent:any) {
    mountElement(vnode, container, parentComponent);
  }
  
  function mountElement(vnode: any, container: any, parentComponent:any) {
    // 创建元素
    const el = (vnode.el = createElement(vnode.type));
  
    // 渲染样式
    const { props, children, shapeFlag } = vnode;
    
    if (props) {
      for (let key in props) {
        patchProp(el, key, props[key])
      }
    }
  
    // 渲染子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChilden(children, el, parentComponent);
    }
  
    // 添加到页面上
    // container.append(el);
    insert(el, container);
  }
  
  function mountChilden(children: any, container: any, parentComponent:any) {
    children.map((child: any) => {
      patch(child, container, parentComponent);
    });
  }

  return {
    createApp: createAppAPI(render)
  }
}


