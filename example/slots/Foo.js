import { h } from "../../lib/mini-vue-esm.js";

export default {
  name: 'foo',

  /** 1.实现匿名插槽 */

  render() {
    return h('div', {
      class: 'foo'
    },
      [
        h('div', null, `count: ${this.count}`),
        this.$slots
      ]
    )
  },
  setup(props) {
    console.log('%c [ props ]-7', 'font-size:13px; background:pink; color:#bf2c9f;', props)
    props.count++
  }
}