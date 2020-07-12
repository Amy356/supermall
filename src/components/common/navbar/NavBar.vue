<template>
  <div id="nav-bar">
    <div class="nav-left"><slot name="left"></slot></div>
    <div class="nav-center"><slot name="center">标题</slot></div>
    <div class="nav-right"><slot name="right"></slot></div>
  </div>

</template>

<script>
    export default {
        name: "NavBar"
    }
</script>

<style scoped>
  #nav-bar {
    position: relative;
    z-index: 10;  /*z-index 属性设置元素的堆叠顺序,仅能在定位元素上奏效*/
    display: flex;
    /*line-height是行高，height就是高，通常height是对于某个框架或者图片来弄的，
    line-height用于文字；另外，line-height和height组合到一块儿，
    还有一种效果，就是如果把它们的值设置的一样了，文字就会在垂直方向居中
    */
    height: 44px;  /*设置元素的高度*/
    line-height: 44px;  /*设置行间的距离（行高）,在DIV中的元素上下居中*/
    text-align: center;
  }
  .nav-left {
    width: 60px;
  }
  .nav-center {
    /*即为flex-grow：1，经常用作自适应布局，将父容器的display：flex，侧边栏大小固定后，
    将内容区flex：1，内容区则会自动放大占满剩余空间。*/
    flex: 1;
  }
  .nav-right {
    width: 60px;
  }

</style>
