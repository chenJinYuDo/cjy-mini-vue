export default {
  name:'app',
  render(){
    return `hello mini vue!` + this.msg
  },
  setup(){
    return {
      msg:'mini'
    }
  }
}