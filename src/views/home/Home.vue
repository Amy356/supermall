<template>
  <div id="home">
    <nav-bar class="nav-bar"><div slot="center">购物街</div></nav-bar>
    <tab-control v-show="isTabFixed" class="fixed" @itemClick="tabClick"
                 :titles="['流行', '新款', '精选']"></tab-control>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            @pullingUp="loadMore"
            :data="showGoodsList"
            :pull-up-load="true"
            :probe-type="3">
      <div>
<!--        ref 有三种用法：
        　　1、ref 加在普通的元素上，用this.$refs.（ref值） 获取到的是dom元素
        　　2、ref 加在子组件上，用this.$refs.（ref值） 获取到的是组件实例，可以使用组件的所有方法。在使用方法的时候直接this.$refs.（ref值）.方法（） 就可以使用了。
        　　3、如何利用 v-for 和 ref 获取一组数组或者dom 节点-->
        <home-swiper :banners="banners"
                     ref="hSwiper"></home-swiper>
        <feature-view :features="recommends"></feature-view>
        <recommend-view></recommend-view>
        <tab-control @itemClick="tabClick"
                     :titles="['流行', '新款', '精选']"
                     ref="tabControl"></tab-control>
        <goods-list :goods-list="showGoodsList"></goods-list>
      </div>
    </scroll>
    <back-top @backTop="backTop" class="back-top" v-show="showBackTop">
      <img src="../../assets/img/common/top.png" alt="">
    </back-top>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  import Scroll from '../../components/common/scroll/Scroll'
  import HomeSwiper from "./childComps/HomeSwiper";
  import BackTop from '../../components/content/backTop/BackTop'
  import FeatureView from './childComps/FeatureView'
  import RecommendView from './childComps/RecommendView'
  import GoodsList from './childComps/GoodsList'
  import {getHomeMultidata, getHomeData, RECOMMEND, BANNER} from "../../network/home";
  import { NEW, POP, SELL, BACKTOP_DISTANCE } from "../../common/const";
  import TabControl from "../../components/content/tabControl/TabControl";

  export default {
    name: "Home",
    components: {
      NavBar,
      Scroll,
      HomeSwiper,
      BackTop,
      FeatureView,
      RecommendView,
      TabControl,
      GoodsList,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goodsList: {
          'pop': {page: 1, list: []},
          'new': {page: 1, list: []},
          'sell': {page: 1, list: []}
         },
        currentType: POP,
        isTabFixed: false,
        tabOffsetTop: 0,
        showBackTop: false
      }
    },
    computed: {
      showGoodsList() {
        return this.goodsList[this.currentType].list
      }
    },
    created() {
      console.log('创建Home');
      // 1.请求多个数据
      this.getMultiData()

      // 2.请求商品数据
      this.getHomeProducts(POP)
      this.getHomeProducts(NEW)
      this.getHomeProducts(SELL)
    },
    /*activated,deactivated这两个生命周期函数一定是要在使用了keep-alive组件后才会有的，
    否则则不存在当引入keep-alive的时候，
    页面第一次进入，钩子的触发顺序created-> mounted-> activated，
    退出时触发deactivated。
    当再次进入（前进或者后退）时，只触发activated。
    */
    activated: function () {
      this.$refs.hSwiper.startTimer()
    },
    deactivated: function () {
      this.$refs.hSwiper.stopTimer();
    },
/*    updated() {
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
      console.log(this.tabOffsetTop);
    },*/
    methods: {

      tabClick(index) {
        console.log( index );
        switch (index) {
          case 0:
            this.currentType = POP
            break
          case 1:
            this.currentType = NEW
            break
          case 2:
            this.currentType = SELL
            break
        }
      },
      contentScroll(position) {
        // 1.决定tabFixed是否显示
        this.isTabFixed = position.y < -this.tabOffsetTop;

        // 2.决定backTop是否显示
        this.showBackTop = position.y < -BACKTOP_DISTANCE;
      },
      loadMore() {
        this.getHomeProducts(this.currentType);
      },
     /* top 等同于  y-coord
      left 等同于  x-coord
      behavior  类型String,表示滚动行为,支持参数 smooth(平滑滚动),instant(瞬间滚动),默认值auto,实测效果等同于instant*/
      backTop() {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      /**
       * 网络请求相关方法
       */
      getMultiData() {
        getHomeMultidata().then(res => {
          this.banners = res.data[BANNER].list
          this.recommends = res.data[RECOMMEND].list
/*          Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。*/
          // 下次更新DOM时,获取新的tabOffsetTop值(不保险,可以在updated钩子中获取)
          /*  $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的DOM*/
          this.$nextTick(() => {
          /* offsetTop obj 距离上方或上层控件的位置*/
            this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
          })
        })
      },
      getHomeProducts(type) {
        getHomeData(type, this.goodsList[type].page).then(res => {
          const goodsList = res.data.list;
          this.goodsList[type].list.push(...goodsList);
          this.goodsList[type].page += 1;

         // 请求数据完成后，调动finishedPullUp
          this.$refs.scroll.finishPullUp();
         })
       }
    }
  }
</script>

<style scoped>
  #home {
    /*position: relative;*/
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .fixed {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
  }

  .back-top {
    position: fixed;
    right: 10px;
    bottom: 60px;
  }
</style>
