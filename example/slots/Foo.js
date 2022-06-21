import { h , renderSlots} from "../../lib/mini-vue-esm.js";

export default {
  name: 'foo',

  /** 1.实现匿名插槽 */
  /** 2.实现多个插槽 */
  render() {
    return h('div', {
      class: 'foo'
    },
      [
        h('div', null, `count: ${this.count}`),
        renderSlots(this.$slots)
      ]
    )
  },
  setup(props) {
    console.log('%c [ props ]-7', 'font-size:13px; background:pink; color:#bf2c9f;', props)
    props.count++
  }
}