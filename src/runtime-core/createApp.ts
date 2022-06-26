import { createVNode } from "./vnode"

export function createAppAPI(render:any){
  return function createApp(rootComponent:any) /**顶层组件*/{
    return {
      /** 挂砸 */ 
      mount(rootContainer:any){
        // 创建虚拟节点
        const vnode = createVNode(rootComponent)
  
        // 渲染
        render(vnode, rootContainer);
      }
    }
  }
}
