<template>
  <swiper>
      <swiper-item v-for="(item,index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="imgloading">
        </a>
      </swiper-item>
    </swiper>
</template>

<script>
import {Swiper, SwiperItem} from "components/common/swiper"
export default {
  name: 'HomeSwiper',
  props: {
    banners: Array,
    default(){
      return []
    } 
  },
  components:{
    SwiperItem,
    Swiper
  },
  methods:{
    imgloading(){
      this.$emit("loaded")
    }
  }
}
</script>

<style>

</style>