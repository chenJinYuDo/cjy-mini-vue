import { h, ref } from '../../lib/mini-vue-esm.js';
export default {
  name:'app',
  render(){
    return h(
      'div',
      {
        id:'demo',
        ...this.props,
      },
      [
        h('button',{
          onClick: this.onChangePropDemo1
        }, '类名'),
        h('button',{
          onClick: this.onChangePropDemo2
        }, '删除类名'),
        h('button',{
          onClick: this.onChangePropsDemo3
        }, '更新类名')
      ]
    )
  },
  setup(){

    const props = ref({
      foo:"foo",
      bar:"bar",
    })

    const onChangePropDemo1 = () => {
      props.value.foo = "new-foo";
    }

    const onChangePropDemo2 = () => {
      props.value.foo = undefined;
    }

    const onChangePropsDemo3 = () => {
      props.value = {
        foo:"foo"
      }
    }



    return {
      props,
      onChangePropDemo1,
      onChangePropDemo2,
      onChangePropsDemo3
    }
  }
}