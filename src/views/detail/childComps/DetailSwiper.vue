<template>
  <swiper class="swiper1">
    <swiper-item v-for="(item, index) in topImages" :key="index">
        <img :src="item" alt="">
    </swiper-item>
  </swiper>
</template>

<script>
import {Swiper, SwiperItem} from "components/common/swiper";
export default {
  name: "DetailSwiper",
  components:{
    Swiper,
    SwiperItem
  },
  props:{
    topImages:{
      type: Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style scoped>
.swiper1{
  height: 300px;
}
</style>