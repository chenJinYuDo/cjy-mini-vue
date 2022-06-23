import { h, createTextVNode, getCurrentInstance } from '../../lib/mini-vue-esm.js';
import Foo from './Foo.js';
window.self = null
export default {
  name: 'app',
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'blue'],
        onClick: () => {
          console.log(this.msg);
        }
      },
      // `hi mini-vue3 ${this.msg}`
      [
        h('div', null, `hi mini-vue3 ${this.msg}`),
        // h('div', null, '匿名插槽')
        // [h('div', null, '匿名插槽') , h('div', null, '匿名插槽')]
        h(Foo, { count: 1 },{
          header:({name}) => [h('div',null, '头部' + name) , createTextVNode('你好呀')],
          body:({sex})=> h('div',null, '身体' + sex)
        })
      ]
    )
  },
  setup() {
    const instance = getCurrentInstance();
    console.log('%c [ instance ]-28', 'font-size:13px; background:pink; color:#bf2c9f;', instance)
    return {
      msg: 'mini'
    }
  }
}