<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
        <span class="icon-remove_circle_outline inner"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
// vuex 参考：https://www.cnblogs.com/jhuang-com/p/6810283.html
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if(!event._constructed) { //阻止非vue触发的事件(这个时间是bscroll里面的，如果不存在这个属性,则为原生点击事件，不执行下面的函数)
          return;
        }
        if(!this.food.count) {
          Vue.set(this.food, 'count', 1); //设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开 Vue 不能检测属性被添加的限制。
        }else{
          this.food.count++;
        }
        this.$root.eventHub.$emit('cartAdd', event.target);
      },
      decreaseCart(event) {
        if(!event._constructed) { //阻止非vue触发的事件(这个时间是bscroll里面的，如果不存在这个属性,则为原生点击事件，不执行下面的函数)
          return;
        }
        if(this.food.count > 0) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scope>
  .cartcontrol{
    font-size: 0;
    .cart-decrease{
      display: inline-block;
      padding: 6px;
      transition: all 0.4s linear;
      .inner{
          display: inline-block;
          color: rgb(0, 160, 220);
          font-size: 24px;
          line-height: 24px;
          transition: all 0.4s linear;
          transform: rotate(0);
        }
      &.move-enter-active,
      &.move-leave-active {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        .inner{
          transition: all 0.4s linear;
          transform: rotate(0);
        }
      }
      &.move-enter,
      &.move-leave-to {
        opacity: 0;
        transform: translate3d(24px, 0, 0);
        .inner{
          transform: rotate(180deg);
        }
      }
    }
    .cart-count{
      display: inline-block;
      font-size: 10px;
      color: rgb(147, 153, 159);
      font-weight: 700;
      width: 12px;
      line-height: 24px;
      text-align: center;
      padding-top: 6px;
      vertical-align: top;
    }
    .cart-add{
      display: inline-block;
      color: rgb(0, 160, 220);
      font-size: 24px;
      line-height: 24px;
      padding: 6px;
    }
  }
</style>
