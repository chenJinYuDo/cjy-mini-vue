import { h } from "../../lib/mini-vue-esm.js";

export default {
  name: 'foo',
  render() {
    return h('div', {
      class: 'foo'
    },
      `count: ${this.count}`
    )
  },
  setup(props) {
    console.log('%c [ props ]-7', 'font-size:13px; background:pink; color:#bf2c9f;', props)
    props.count++
  }
}