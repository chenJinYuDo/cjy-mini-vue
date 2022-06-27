import { effect } from "../reactivity";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options:any){
  const {
    createElement:hostCreateElement, /** 创建元素的接口 */
    patchProp:hostPatchProp,/** 绑定属性的接口 */
    insert:hostInsert /** 插入元素的接口 */
  } = options

  function render(vnode: any, container: any) {
    patch(null , vnode, container, null);
  }
  
  /** patch函数递归关键 */
  /**
   * n1 是旧节点
   * n2 是新节点 | 初始节点
  */
  function patch(n1:any , n2: any, container: any, parentComponent:any) {
    /**
     * 检查n2节点类型
     * 如果是组件
     *  xxx
     * 如果是元素
     *  xxx
     * */
    // debugger
    const { type } = n2;
  
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        const { shapeFlag } = n2;
  
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理element
          processElement(n1 ,n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }
  
  function processFragment(n1:any, n2: any, container: any, parentComponent:any) {
    const { children } = n2;
    mountChilden(children, container, parentComponent);
  }
  
  function processText(n1:any ,n2: any, container: any){
   const el = (n2.el = document.createTextNode(n2.children));
   container.append(el);
  }
  
  /** 创建组件过程 */
  function processComponent(n1:any , n2: any, container: any, parentComponent:any) {
      mountComponent(n2, container, parentComponent);
  }
  function mountComponent(initalVNode: any, container: any, parentComponent:any) {
    // 创建组件实例
    const instance = createComponentInstance(initalVNode, parentComponent);
  
    // 调用关于组件setup的事情
    setupComponent(instance);
  
    setupRenderEffect(instance, initalVNode, container);
  }
  
  function setupRenderEffect(instance: any, initalVNode: any, container: any) {
    effect(() => {
      // 区分初始化 或者 更新
      const { isMounted } = instance;

      if(!isMounted){ //初始化
        console.log("初始化=======")
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null , subTree, container, instance);
      
        // 关键点在patch Element完成之后，component 的 虚拟节点才能访问el
        initalVNode.el = subTree.el;
        instance.isMounted = true
      }else{
        console.log("更新========")
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevTree = instance.subTree;
        patch(prevTree, subTree, container, instance);
        instance.subTree = subTree;
      }

    })
  }
  
  function processElement(n1:any ,n2: any, container: any, parentComponent:any) {
    if(!n1){
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function patchElement(n1:any, n2:any, container:any, parentComponent:any){
    // 需要对比 n1 和 n2 两个虚拟节点并重新更新
    // 更新Props
    const oldProps = n1.props || {},
          newProps = n2.props || {},
          el = (n2.el = n1.el); // 注意这里 n2会变成n1
    patchProps(el, oldProps, newProps);
  }

  function patchProps(el:any , oldProps:any, newProps:any){
    for(const key in newProps){
      const nextProp = newProps[key];
      const prevProp = oldProps[key];
      if(nextProp !== prevProp){
        hostPatchProp(el, key, prevProp, nextProp)
      }
    }

    for(const key in oldProps){
      if(!newProps[key]){
        hostPatchProp(el, key, oldProps[key], null)
      }
    }
  }
  
  function mountElement(vnode: any, container: any, parentComponent:any) {
    // 创建元素
    const el = (vnode.el = hostCreateElement(vnode.type));
  
    // 渲染样式
    const { props, children, shapeFlag } = vnode;

    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
  
    // 渲染子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChilden(children, el, parentComponent);
    }
  
    // 添加到页面上
    hostInsert(el, container);
  }
  
  function mountChilden(children: any, container: any, parentComponent:any) {
    children.map((child: any) => {
      patch(null , child, container, parentComponent);
    });
  }

  return {
    createApp: createAppAPI(render)
  }
}


