<template>
  <div class="tab-control">
    <div class="tab-control-item"
         :class="{ active: currentIndex === index }"
         @click="itemClick(index)"
         v-for="(item, index) in titles">
         <span>{{item}}</span>
    </div>
  </div>

</template>

<script>
    export default {
      name: "TabControl",
      props: {
        /*默认值类型为数组或对象，一定要在函数中返回这个默认值，而不是直接写*/
        titles: Array,
        default() {
          return [];
        }
      },
      data: function () {
        return {
          currentIndex: 0
        }
      },
      methods: {
        itemClick: function (index) {
          // 1.改变currentIndex
          this.currentIndex = index;

          // 2.发出事件  监听event事件后运行 fn；
          // 子组件可以使用 $emit 触发父组件的自定义事件。
          this.$emit('itemClick',index) //itemClick事件触发后，自动触发itemClick事件
        }
      }
    }
</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
    line-height: 40px;
    font-size: 15px;
    background-color: #ffffff;
    z-index: 10;
  }

  .tab-control-item {
    flex: 1;
  }

  .tab-control-item span {
    padding: 5px;
  }

  .active {
    color: var(--color-high-text);
  }

  .active span {
    border-bottom: 2px solid var(--color-high-text);
  }
</style>
