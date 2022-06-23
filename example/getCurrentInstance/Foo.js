import { h, renderSlots , getCurrentInstance } from "../../lib/mini-vue-esm.js";

export default {
  name: 'foo',

  /** 1.实现匿名插槽 */
  /** 2.实现多个插槽 */
  /** 3.实现具名插槽
   *  (1) 要知道具体名字
   *  (2) 要知道对应位置
   *  使用obj处理
   *  4.作用域插槽
   *  使用函数处理
   */
  render() {
    return h('div', {
      class: 'foo'
    },
      [
        h('div', null, `count: ${this.count}`),
        renderSlots(this.$slots, "header", { name: 'cjy' }),
        renderSlots(this.$slots, "body", { sex: '男' })
      ]
    )
  },    
  setup(props) {
    const instance = getCurrentInstance();
    console.log('%c [ instance ]-28', 'font-size:13px; background:pink; color:#bf2c9f;', instance)
    props.count++
  }
}