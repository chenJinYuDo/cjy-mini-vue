import { isObject } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

/** patch函数递归关键 */
function patch(vnode: any, container: any) {
  /**
   * 检查vnode节点类型
   * 如果是组件
   *  xxx
   * 如果是元素
   *  xxx
   * */
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    // 处理element
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    // 处理组件
    processComponent(vnode, container);
  }
}

/** 创建组件过程 */
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
function mountComponent(initalVNode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(initalVNode);

  // 调用关于组件setup的事情
  setupComponent(instance);

  setupRenderEffect(instance, initalVNode, container);
}

function setupRenderEffect(instance: any, initalVNode: any, container: any) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);

  // 关键点在patch Element完成之后，component 的 虚拟节点才能访问el
  initalVNode.el = subTree.el;
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  // 创建元素
  const el = (vnode.el = document.createElement(vnode.type));

  // 渲染样式
  const { props, children, shapeFlag } = vnode;
  if (props) {
    for (let key in props) {
      if(isEvent(key)){
        el.addEventListener(key.slice(2).toLocaleLowerCase(),props[key])
      }else{
        el.setAttribute(key, props[key]);
      }
    }

    /** 命名规范 on+一个大写字母 */
    function isEvent(key:string){
      return /^on[A-Z]/.test(key);
    }
  }

  // 渲染子节点
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    children.map((child:any) => {
      patch(child, el);
    });
  }

  // 添加到页面上
  container.append(el);
}
