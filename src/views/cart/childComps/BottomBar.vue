<template>
  <div class="bottom-menu">
    <CheckButton class="select-all" @checkBtnClick="checkBtnClick" v-model="isSelectAll"></CheckButton>
    <span>全选</span>
    <span class="total-price">合计: ¥{{totalPrice}}</span>
    <span class="buy-product" @click="calculate">去计算({{count}})</span>
  </div>
</template>

<script>
  import CheckButton from './CheckButton'
  import { mapGetters } from 'vuex'

	export default {
		name: "BottomBar",
    components: {
		  CheckButton
    },
    data(){
     return {
       count: 0
       }
    },
    computed: {
      ...mapGetters(['cartList']),
		  totalPrice() {
        const checkedItem = this.cartList.filter(item => {
          return item.checked
        })
        // this.count = checkedItem.reduce((preValue, item) => {
        //   return preValue + item.count
        // }, 0)
        return checkedItem.reduce((preValue, item) => {
          this.count += item.count
          return preValue + item.count * item.price
        }, 0).toFixed(2)
      },
      
      isSelectAll() {
        if(this.cartList.length === 0){
          return false
        }else{
          return !this.cartList.find(item => item.checked === false)
        }
      }
    },
    methods: {
      checkBtnClick() {
        // 1.判断是否有未选中的按钮
        let isSelectAll = this.cartList.find(item => !item.checked);

        // 2.有未选中的内容, 则全部选中
        if (isSelectAll) {
          this.cartList.forEach(item => {
            item.checked = true;
          });
        } else {
          this.cartList.forEach(item => {
            item.checked = false;
          });
        }
      },
      calculate(){
        const cal = this.cartList.filter(item => {
          return item.checked
        })
        if(cal.length == 0){
          this.$toast.show("请选择商品", 2000)
        }        
      }
    }
	}
</script>

<style scoped>
  .bottom-menu {
    width: 100%;
    height: 44px;
    background-color: #eee;
    position: fixed;
    bottom: 48px;
    left: 0;
    box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
    font-size: 14px;
    color: #888;
    line-height: 44px;
    padding-left: 35px;
    box-sizing: border-box;
  }

  .bottom-menu .select-all {
    position: absolute;
    line-height: 0;
    left: 12px;
    top: 13px;
  }

  .bottom-menu .total-price {
    margin-left: 15px;
    font-size: 16px;
    color: #666;
  }

  .bottom-menu .buy-product {
    background-color: orangered;
    color: #fff;
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    float: right;
  }
</style>
