import { h } from "../../lib/mini-vue-esm.js";

export default {
  name: 'foo',
  render() {
    return h('div', {
      class: 'foo'
    },
      [
        h('button', {
          onClick: this.handlerClick,
        }, '加'),
        h('div', null, `count: ${this.count}`)
      ]
    )
  },
  setup(props, { emit }) {
    console.log('%c [ props ]-7', 'font-size:13px; background:pink; color:#bf2c9f;', props)
    props.count++

    const handlerClick = () => {
      console.log('加')
      emit('add')
      emit('add-foo')
    }

    return {
      handlerClick
    }
  }
}