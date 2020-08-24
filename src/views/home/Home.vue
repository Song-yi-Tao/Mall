<template>
  <div id="home">
    <nav-bar class="nav-bar">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"  
                    @tabClick="tabClick"
                    class="tab-control"
                    ref="tabControl1"
                    v-show="isFixed"></tab-control>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            @pullingUp="loadMore"
            :pullUpLoad="true">
      <home-swiper :banners="banners" @loaded.once="imgload"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']"  
                    @tabClick="tabClick"
                    ref="tabControl2"></tab-control>
      <goods-list :goodsList="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backtop" v-show="isShow"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import Scroll from "components/common/scroll/Scroll.vue";


import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

import { getHomeMultidata, getHomeGoods } from "network/home.js";
import {debounce} from '@/common/utils'
import {backTopMixin} from '@/common/mixin'

export default {
  name: "Home",
  components: {
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    HomeSwiper,
    RecommendView,
    FeatureView
  },
  mixins: [backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      Top: 0,
      isFixed: false,
      saveY: 0
    }
  },
  created() {
    this.getHomeMultidata(),
    this.getHomeGoods("pop"),
    this.getHomeGoods("new"),
    this.getHomeGoods("sell");

  },
  mounted(){
    let func = debounce(this.$refs.scroll.refresh, 50)
      this.$bus.$on("homefreshScroll", () => {
          func()
    })
  },
  activated(){
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
  },
  deactivated(){
    // console.log(this.$refs.scroll.scroll.y);
    this.saveY = this.$refs.scroll.scroll.y
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  methods: {
    //事件监听
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    contentScroll(pos){
      this.isShow = (-pos.y) > 1000
      this.isFixed = (-pos.y) > this.Top
    },
    
    loadMore(){
      this.getHomeGoods(this.currentType)
      
    },
    imgload(){
      this.Top = this.$refs.tabControl2.$el.offsetTop
    },

    //网络请求
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // console.log(res)
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page++;

        this.$refs.scroll.finishPullUp()
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}

.content{
 overflow: hidden;
 position: absolute;
 bottom: 49px;
 top: 44px;
 left: 0;
 right: 0;
}
.tab-control{
  position: relative;
  z-index: 9;
}
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>