import { h } from '../../lib/mini-vue-esm.js';
export default {
  name:'app',
  render(){
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'blue']
      },
      `hi mini-vue3 ${this.msg}`
    )
  },
  setup(){
    return {
      msg:'mini'
    }
  }
}