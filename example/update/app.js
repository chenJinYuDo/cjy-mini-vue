import { h, ref } from '../../lib/mini-vue-esm.js';
export default {
  name:'app',
  render(){
    return h(
      'div',
      {},
      [
        h('p', {}, `count:${this.count}`),
        h('button',{
          onClick: this.addOne
        }, '加一')
      ]
    )
  },
  setup(){

    const count = ref(0);

    const addOne = ()=> {
      this.count.value += 1
    }


    return {
      count,
      addOne
    }
  }
}