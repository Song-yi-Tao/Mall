<template>
  <div id="detail">
    <detail-nav-bar class="nav-bar"  @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @detailImageDetail="loaddown"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goodsList="recommends"></goods-list>
    </scroll>
    <back-top @click.native="backtop" v-show="isShow"></back-top>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
  </div>
</template>

<script>
import DetailNavBar from 'views/detail/childComps/DetailNavBar'
import DetailSwiper from 'views/detail/childComps/DetailSwiper'
import DetailBaseInfo from 'views/detail/childComps/DetailBaseInfo'
import DetailShopInfo from 'views/detail/childComps/DetailShopInfo'
import DetailGoodsInfo from 'views/detail/childComps/DetailGoodsInfo'
import DetailParamInfo from 'views/detail/childComps/DetailParamInfo'
import DetailCommentInfo from 'views/detail/childComps/DetailCommentInfo'
import DetailBottomBar from 'views/detail/childComps/DetailBottomBar'



import Scroll from "components/common/scroll/Scroll.vue"
import GoodsList from "components/content/goods/GoodsList"

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import {debounce} from '@/common/utils'
import {backTopMixin} from '@/common/mixin'


export default {
  name: 'Detail',
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  },
  mixins: [backTopMixin],
  data(){
    return{
      id: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      topsY: [],
      currentIndex: 0,
      refresh: null,
      freshTop: null

    }
  },
  created(){
    this.id = this.$route.params.id
    // console.log(this.id);
    getDetail(this.id).then(res => {
      const data = res.result
      this.topImages = data.itemInfo.topImages

      //商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      this.shop = new Shop(data.shopInfo)
      this.detailInfo = data.detailInfo
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      if(data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0]
      } 
    }),
    //请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
  },
  mounted(){
    this.refresh = debounce(this.$refs.scroll.refresh, 100);
    this.freshTop = debounce(this.getTopsY, 100);
    this.$bus.$on("detailfreshScroll", () => {
      this.refresh()
    });
  },
  methods: {
    titleClick(index){
      this.$refs.scroll.scrollTo(0, -this.topsY[index], 100)
    },
    loaddown(){
      this.refresh()
      this.freshTop()
    },
    getTopsY(){
      //获取详情页各模块位置
      this.topsY = [];
      this.topsY.push(0);
      this.topsY.push(this.$refs.params.$el.offsetTop)
      this.topsY.push(this.$refs.comment.$el.offsetTop)
      this.topsY.push(this.$refs.recommend.$el.offsetTop)
      // console.log(this.topsY);
    },
    contentScroll(pos){
      // console.log(pos);
      //backtop
      this.isShow = (-pos.y) > 1000

      const posY = -pos.y
      if(posY > 0 && posY < this.topsY[1]){
        // console.log(this.topsY);
        this.currentIndex = 0
      }else if(posY >= this.topsY[1] && posY < this.topsY[2]){
        this.currentIndex = 1
      }else if(posY >= this.topsY[2] && posY < this.topsY[3]){
        this.currentIndex = 2
      }else if(posY > this.topsY[3]){
        this.currentIndex = 3
      }
      this.$refs.nav.currentIndex = this.currentIndex
    },
    addToCart(){
      //获取购物车需展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.nowPrice;
      product.id = this.id;

      this.$store.dispatch('addCart', product).then(res => {
        this.$toast.show(res, 1500)
      })


    }
  }
}
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .nav-bar{
    /* position: fixed; */
    background-color: #fff;
  }
  .content{
    overflow: hidden;
    position: absolute;
    bottom: 49px;
    top: 44px;
    left: 0;
    right: 0;
  }
</style>