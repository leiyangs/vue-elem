<template>
    <div class="goods-wrapper">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li :key="index" v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <i class="icon" v-show="item.type>0" :class="classMap[item.type]"></i>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li class="foods-list foods-list-hook" v-for="(item,index) in goods" :key="index">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="(food, index) in item.foods" :key="index" class="food-item border-1px" @click="selectFood(food,$event)">
                            <div class="icon">
                                <img :src="food.icon" alt="" width="57" height="57">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}</span>
                                </div>
                                <div class="price">
                                    <span class="nowPrice">￥{{food.price}}</span><span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                  <!-- 此处传入cartcontrol一个方法cartAdd，后面兄弟组件回传值($emit传值父组件相当于绑定方法) -->
                                  <cartcontrol :food="food" @cartAdd="cartAdd()"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart ref="shopcart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :select-foods="selectFoods()"></shopcart>  
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import BScroll from "better-scroll";
import shopcart from "@/components/shopcart/shopcart";
import cartcontrol from "@/components/cartcontrol/cartcontrol";
import food from "@/components/foodDetail/food";

const ERR_OK = 0;
const eventHub = new Vue();
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  created() {
    this.axios.get("/api/goods").then(data => {
      data = data.data;
      if (data.errno === ERR_OK) {
        this.goods = data.data;
        this.$nextTick(() => { //DOM发生变化后再执行下面方法
          this._inintScroll();
          this._calculateHeight();
        });
      }
    }),
      (this.classMap = [
        "decrease",
        "discount",
        "special",
        "invoice",
        "guarantee"
      ]);
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        const height1 = this.listHeight[i];
        const height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    }
  },
  methods: {
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodsList = this.$refs.foodsWrapper.getElementsByClassName(
        "foods-list-hook"
      );
      let el = foodsList[index];
      this.foodsScroll.scrollToElement(el, 300); //插件方法
    },
    _inintScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });

      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      }); // 定义ref不要用-连接  probeType插件方法

      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      }); //插件滚动事件
    },
    _calculateHeight() {
      let foodsList = this.$refs.foodsWrapper.getElementsByClassName(
        "foods-list-hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodsList.length; i++) {
        let item = foodsList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if(food.count) {
            foods.push(food);
          }
        })
      });
      return foods;
    },
    selectFood(food, event) {
      if (!event._constructed) { //阻止非vue触发的事件(这个时间是bscroll里面的，如果不存在这个属性,则为原生点击事件，不执行下面的函数)
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show(); //调用子组件方法
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scope>
@import "../../common/sass/mixins";

.goods-wrapper {
  display: flex;
  width: 100%;
  position: absolute;
  top: 176px;
  bottom: 46px;
  overflow: hidden;
  //左边菜单
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
    .menu-item {
      display: table;
      width: 56px;
      height: 54px;
      line-height: 14px;
      font-size: 0;
      padding: 0 12px 0 12px;
      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 700;
        .text {
          @include border-none();
        }
      }
      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
        &.decrease {
          @include bg-img(decrease_3);
        }
        &.discount {
          @include bg-img(discount_3);
        }
        &.guarantee {
          @include bg-img(guarantee_3);
        }
        &.invoice {
          @include bg-img(invoice_3);
        }
        &.special {
          @include bg-img(special_3);
        }
      }
      .text {
        width: 56px;
        font-size: 12px;
        display: table-cell;
        vertical-align: middle; //垂直居中
        @include border-1px(rgba(7,17,27,0.1));
      }
    }
  }
  //分类商品
  .foods-wrapper {
    flex: 1;
    .foods-list {
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        background: #f3f5f7;
        color: rgb(147, 153, 159);
      }
      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          @include border-none();
          margin-bottom: 0;
        }
        .icon {
          width: 57px;
          height: 57px;
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            margin: 2px 0 8px 0;
            color: rgb(7, 17, 27);
          }
          .desc,
          .extra {
            line-height: 14px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            margin-bottom: 8px;
          }
          .extra {
            .count {
              margin-right: 12px;
            }
          }
          .price {
            font-weight: 700;
            line-height: 24px;
            .nowPrice {
              font-size: 14px;
              margin-right: 8px;
              color: rgb(240, 20, 20);
            }
            .oldPrice {
              font-size: 10px;
              color: rgb(174, 153, 159);
              text-decoration: line-through;
            }
          }
          .cartcontrol-wrapper{
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
}
</style>
