import { h } from '../../lib/mini-vue-esm.js';
window.self = null
export default {
  name:'app',
  render(){
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'blue'],
        onClick:() => {
          console.log(this.msg);
        }
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