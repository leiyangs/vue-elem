<template lang="html">
    <div>
        <div class="shopcart">
            <div class="shopcart-wrapper">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{highlight: totalCount>0}" @click="toggleList">
                            <i class="icon icon-shopping_cart"></i>   
                        </div>
                        <div class="num" v-show="totalCount>0">
                            {{totalCount}}
                        </div>
                    </div>
                    <div class="price" :class="{hightlight: totalPrice>0}">
                        ￥{{totalPrice}}
                    </div>
                    <div class="desc">
                        另需配送费￥{{deliveryPrice}}元
                    </div>
                </div>
                <div class="content-right" @click="pay">
                    <div class="pay" :class="payClass">
                        {{payDesc}}
                    </div>
                </div>
            </div>
            <div class="ball-container">
                <transition name="drop" v-for="(ball,index) in balls" :key="index" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition> 
            </div>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food border-1px" v-for="(food,index) in selectFoods" :key="index">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="listMask">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import cartcontrol from "@/components/cartcontrol/cartcontrol";

export default {
  props: {
      selectFoods: {
          type: Array,
          default() { 
              return [];//默认值 数组和对象时default为函数
          }
      },
      deliveryPrice: {
          type: Number,
          default: 0    //默认值
      },
      minPrice: {
          type: Number,
          default: 0
      }
  },
  components: {
    cartcontrol  
  },
  data () {
    return {
        balls: [
            {
            show: false
            },
            {
            show: false
            },
            {
            show: false
            },
            {
            show: false
            },
            {
            show: false
            }
        ]  ,
        dropBalls: [],
        fold: false
    }
  },
  computed: {
      totalPrice() {
          let total = 0;
          this.selectFoods.forEach((food) => {
              total += food.price * food.count;
          });
          return total;
      },
      totalCount() {
          let count = 0;
          this.selectFoods.forEach((food) => {
              count += food.count;
          });
          return count;
      },
      payDesc() {
          if(this.totalPrice === 0) {
              return `￥${this.minPrice}元起送`;
          }else if(this.totalPrice < this.minPrice) {
              let diff = this.minPrice - this.totalPrice;
              return `还差￥${diff}元起送`;
          }else if(this.totalPrice >= this.minPrice) {
              return '结算';
          }
      },
      payClass() {
          if(this.totalPrice < this.minPrice) {
              return 'not-enough'
          }else{
              return 'enough'
          }
      },
      listShow() {
          if(!this.totalCount) {
              this.fold = true;
              return false;
          } 
          let show = !this.fold;
          if(show) {
              if(!this.scroll) {
                this.$nextTick(() => {
                    this.scroll = new BScroll(this.$refs.listContent,{
                        click:true
                    });
                });
              }else{
                this.scroll.refresh();
              }
          }
          return show;
      }
  },
  created() {
    this.$root.eventHub.$on('cartAdd', this.drop)
  },
  methods: {
      drop(el) {
        for(let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            if(!ball.show) {
                ball.show = true;
                ball.el = el;
                this.dropBalls.push(ball);
                return;
            }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
            let ball = this.balls[count];
            if(ball.show) {
                let rect = ball.el.getBoundingClientRect();  //getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。 
                let x = rect.left - 32;
                let y = -(window.innerHeight - rect.top - 22);
                el.style.display = '';
                el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                el.style.transform = `translate3d(0,${y}px,0)`;
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                inner.style.transform = `translate3d(${x}px,0,0)`;
            }
        }
      },
      enter(el) {
        /*  */
        el.offsetHeight; // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
        this.$nextTick(() => {
            el.style.webkitTransform = `translate3d(0,0,0)`;
            el.style.transform = `translate3d(0,0,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(0,0,0)`;
            inner.style.transform = `translate3d(0,0,0)`;
        })
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if(ball) {
            ball.show = false;
            el.style.display = 'none';
        }
      },
      //  点击显示购物车
      toggleList() {
          if(!this.totalCount) {
              return;
          }
          this.fold = !this.fold;
      },
      //  清空购物车  
      empty() {
          this.selectFoods.forEach((food) => {
              food.count = 0;
          })
      },
      //  点击遮罩影藏购物车
      hideList() {
          this.fold = true;
      },
      //  结算
      pay() {
          if(this.totalPrice < this.minPrice) {
              return;
          }
          window.alert(`支付${this.totalPrice}`)
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scope>
@import "../../common/sass/mixins";

.shopcart{
    width: 100%;
    height: 48px;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    font-size: 0;
    .shopcart-wrapper{
        display: flex;
        background: #141d27;
        .content-left{
            flex: 1;
            // 购物车
            .logo-wrapper{
                display: inline-block;
                width: 56px;
                height: 56px;
                position: relative;
                top: -10px;
                margin: 0 12px;
                padding: 6px;
                border-radius: 50%;
                box-sizing: border-box;
                vertical-align: top;
                background: #141d27;
                .logo{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2d343d;
                    text-align: center;
                    .icon{
                        font-size: 24px;
                        line-height: 44px;
                        color: #80858a;
                    }
                    &.highlight {
                        background: rgb(0, 160, 220);
                        .icon{
                            color: #fff;
                        }
                    }
                }
            }
            // 个数
            .num{
                position: absolute;
                top: 0;
                right: 0;
                width: 24px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                border-radius: 16px;
                background: red; 
                color: #fff;
                font-size: 9px;
                font-weight: 700px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
            }
            /* 价钱 */
            .price{
                display: inline-block;
                height: 24px;
                line-height: 24px;
                vertical-align: top;
                margin: 12px 0;
                padding-right: 12px;
                color: rgba(255, 255, 255, 0.4);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                box-sizing: border-box;
                font-size: 16px;
                font-weight: 700;
                &.hightlight{
                    color: #fff;
                }
            }
            .desc{
                height: 24px;
                line-height: 24px;
                display: inline-block;
                vertical-align: top;
                font-size: 10px;
                color: rgba(255, 255, 255, 0.4);
                margin: 12px 12px 0;
            }
        }
        .content-right{
            flex: 0 0 105px;
            width: 105px;
            .pay{
                width: 100%;
                height: 48px;
                font-size: 12px;
                font-weight: 700;
                line-height: 48px;
                text-align: center;
                &.not-enough{
                 background: #2b333b;
                 color: rgba(255, 255, 255, 0.1); 
                }
                &.enough{
                    background: #00b43c;
                    color: #fff;
                }
            }
        }
    }
    .ball-container{
        .ball{
           position: fixed;
           left: 32px;
           bottom: 22px;
           z-index: 200;
           transition: all 0.4s;
           &.drop-enter,&.drop-enter-active{
                transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
                .inner{
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgb(0,160,220);
                    transition: all 0.4s linear;
                }
           }
        }
    }
    .shopcart-list{
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        transition: all 0.5s;
        transform: translate3d(0,-100%,0);        
        &.fold-enter-active,
        &.fold-leave-active{
            transition: all 0.5s;
        }
        &.fold-enter,
        &.fold-leave-active{
            transform: translate3d(0,0,0);
        }
        .list-header{
            height: 40px;
            line-height: 40px;
            padding: 0 18px;
            background: #f3f5f7;
            border-bottom: 2px solid rgba(7,17,27,0.1);
            .title{
                float: left;
                font-size: 14px;
                color: rgb(7,17,27);
            }
            .empty{
                float: right;
                font-size: 12px;
                color: rgb(0,160,220);
            }
        }
        .list-content{
            padding: 0 18px;
            max-height: 217px;
            background: #fff;
            overflow: hidden;
            .food{
                position: relative;
                padding: 12px 0;
                box-sizing: border-box;
                @include border-1px(rgba(7,17,27,0.1));
                .name{
                    line-height: 24px;
                    font-size: 14px;
                    color: rgb(7,17,27);
                }
                .price{
                    position: absolute;
                    bottom: 12px;
                    right: 90px;
                    line-height: 24px;
                    font-size: 14px;
                    color: rgb(240,20,20);
                    font-weight: 700;
                }
                .cartcontrol-wrapper{
                    position: absolute;
                    bottom: 6px;
                    right: 0;
                }
            }
        }       
    }
}
.list-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    backdrop-filter: blur(10px);
    transition: all 0.5s;
    opacity: 1;
    background: rgba(7,17,27,0.6);
    &.listMask-enter-active,
    &.listMask-leave-active{
        transition: all 0.5s;
    }
    &.listMask-enter,
    &.listMask-leave-active{
        opacity: 0;
        background: rgba(7,17,27,0);
    }
}
</style>