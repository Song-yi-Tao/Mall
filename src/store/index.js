import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addCounter(state, payload){
      payload.count++
    },
    addToCart(state, payload){
      state.cartList.push(payload)
    }
  },
  actions:{
    addCart(context, payload){
      return new Promise((resolve, reject) => {
        let product = null
        product = context.state.cartList.find(item => item.id === payload.id)
        if(product){
        context.commit('addCounter', product)
        resolve("当前商品数量+1")
      }else{
        payload.count = 1
        payload.checked = false
        context.commit('addToCart', payload)
        resolve("已加入购物车")
      }
      })
    }
  },
  getters:{
    cartLength(state){
      return state.cartList.length
    },
    cartList(state){
      return state.cartList
    },
    goodsCount(state){
      let count = 0
      for(let item of state.cartList){
        count += item.count
      }
      return count
    }
  }
})

export default store