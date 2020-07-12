<template>
<!--  BetterScroll 只处理容器（wrapper）的第一个子元素（content）的滚动，其它的元素都会被忽略。-->
  <div ref="wrapper">
    <slot />
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

    export default {
      name: "Scroll",
      props: {
        probeType: {
          type: Number,
          default: 1
        },
        data: {
          type: Array,
          default: () => {
            return []
          }
        },
        pullUpLoad: {
          type: Boolean,
          default: false,
        }
      },
      data: function () {
        return {
          scroll: {}
        }
      },
      // 保证在DOM渲染完毕后初始化better-scroll
      mounted() {
        setTimeout(this.__initScroll,20)
      },
      methods: {
        __initScroll() {
          // 1.初始化BScroll对象  wrapper的DOM对象;
          // 在初始化它的时候，必须确保父元素和子元素的内容已经正确渲染了。
          // 子元素或者父元素 DOM 结构发生改变的时候，
          // 必须重新调用 scroll.refresh() 方法重新计算来确保滚动效果的正常。
          if (!this.$refs.wrapper) return
          this.scroll = new BScroll(this.$refs.wrapper, {
            probeType: this.probeType,
            click: true,
            pullUpLoad: this.pullUpLoad
          })

          // 2.将监听事件回调
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos)
          })

          // 3.监听上拉到底部  是否派发滚动到底部的事件，用于上拉加载
          this.scroll.on('pullingUp', () => {
            console.log('上拉加载');
            this.$emit('pullingUp')
          })
        },

        //当已经存在berre-scroll实例的时候，DOM发生变化时，要对better-scroll实例重新更新
        refresh() {
          this.scroll && this.scroll.refresh && this.scroll.refresh()
        },
        finishPullUp() {
          this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
        },
        // 代理better-scroll的scrollTo方法
        scrollTo(x, y, time) {
          this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
        }
      },
      watch: {
        // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
        data() {
          setTimeout(this.refresh, 20)
        }
      }
    }
</script>

<style scoped>

</style>
