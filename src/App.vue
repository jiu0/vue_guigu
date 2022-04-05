<template>
  <div id="app">
    <!-- <h3>我是父组件</h3>
    <h3>scoped 的样式</h3>
    <Child />
    <Child1 /> -->
    <router-view />
  </div>
</template>

<script>
//import Child from './components/Child.vue'
//import Child1 from './components/Child1.vue'
export default {
  name: 'App',
  components:{
   //  Child,
   //  Child1
  },
}
</script>
<style scoped>
/*  添加 scoped   当前元素 h3  和父元素 都会添加一个 data-v-xxx 的自定义属性选择器
如果 子组件Child的根元素就是h3   那么父组件写在h3 上的样式 子组件上也会有  如果子组件的根元素不是 h3 就不会直接继承父组件的h3 样式
如果 父组件 写了 scoped  子组件child1 套了几层元素  想要父组件的 h3 样式 影响 子组件child1 的样式 需要用深度选择器
深度选择器 可以实现 样式的穿透 原生 css  >>>  less /deep/  scss  ::v-deep 
在父组件上使用 >>> 可以把样式穿透 给子组件 
1 父组件不用 scoped  子组件可以继承 父组件的样式  2 父组件使用了scoped 子组件的根元素是h3 也可以继承样式
3 父组件使用了scoped 子组件的根元素不是h3 在父组件上使用 >>> 子组件也可以继承h3样式
*/
>>>h3{
  color:red;
}

</style>