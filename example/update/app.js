import { h, ref } from '../../lib/mini-vue-esm.js';
export default {
  name:'app',
  render(){
    return h(
      'div',
      {},
      [
        h('p', {}, `count:${this.count}`), // 收集依赖
        h('button',{
          onClick: this.addOne
        }, '加一')
      ]
    )
  },
  setup(){

    const count = ref(0);

    const addOne = ()=> {
      count.value += 1
    }


    return {
      count,
      addOne
    }
  }
}