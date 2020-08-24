<template>
  <div id="cart">
    <nav-bar class="nav-bar"><div slot="center">购物车({{typeCount}})</div></nav-bar>
    <scroll class="content">
      <cart-list class="cart-list" :cart-list="list"></cart-list>
    </scroll>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from "components/common/scroll/Scroll"
  import CartList from './childComps/CartList'
  import BottomBar from './childComps/BottomBar'
  import { mapGetters } from 'vuex'
  
	export default {
		name: "Cart",
    components: {
		  NavBar,
      CartList,
      BottomBar,
      Scroll
    },
    computed: {
		  ...mapGetters({
        typeCount: 'cartLength',
        list: 'cartList',
        count: 'goodsCount'
      })
    }
	}
</script>

<style scoped>
  #cart {
    position: relative;
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content{
    overflow: hidden;
    position: absolute;
    bottom: 93px;
    top: 44px;
    left: 0;
    right: 0;
  }
</style>
