import { h } from '../../lib/mini-vue-esm.js';
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
          // console.log(this.msg);
        }
      },
      // `hi mini-vue3 ${this.msg}`
      [
        h('div', null, `hi mini-vue3 ${this.msg}`),
        h(Foo, { 
          count: 1,
          onAdd:()=>{
            console.log('%c [ f ]-23', 'font-size:13px; background:pink; color:#bf2c9f;', 'aaa')
          },
          onAddFoo:()=>{
            console.log('%c [ f ]-23', 'font-size:13px; background:pink; color:#bf2c9f;', 'onAddFoo')
          }
        })
      ]
    )
  },
  setup() {
    return {
      msg: 'mini'
    }
  }
}