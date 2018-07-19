<template>
    <transition name="move">
        <div class="food" v-show="showFlag" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back" @click="back">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <!-- cart组件 -->
                    <div class="cartcontrol-wrapper">
                        <cartcontrol @add="addFood" :food="food"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div class="buy" v-show="!food.count || food.count === 0" @click="addFirst">加入购物车</div>
                    </transition>
                </div>
                <!-- 分割线 -->
                <split v-show="food.info"></split>
                <!-- 商品介绍 -->
                <div class="info" v-show="food.info">
                    <h1 class="title">
                        商品信息
                    </h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <!-- 分割线 -->
                <split v-show="food.info"></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <!-- ratings选项 -->
                    <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                    <!-- 评价 -->
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                                </div>
                                <div class="time">
                                    {{rating.rateTime | formatDate}}
                                </div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                                    <span>{{rating.text}}</span>
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
                            暂无评价
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
import {formatDate} from '@/common/js/date'; //花括号内可以引入多个模块 ，公共方法单独封装
import BScroll from "better-scroll";
import cartcontrol from "@/components/cartcontrol/cartcontrol";
import split from "@/components/split/split";
import ratingselect from "@/components/ratingselect/ratingselect"

const ALL = 2;

export default {
    props: {
        food: {
            type: Object
        }
    },
    data () {
        return {
            showFlag: false,
            selectType: ALL,
            onlyContent: true, //只看内容评价开关
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    methods: {
        show() {
            /* 
             * 初始化
            */
            this.showFlag = true; 
            this.selectType = ALL; 
            this.onlyContent = true;

            this.$nextTick(() => { //DOM发生变化后再执行下面方法
                if(!this.scroll) {
                    this.scroll = new BScroll(this.$refs.food, {
                        click: true
                    });
                }else{
                    this.scroll.refresh();
                }
            })
        },
        back() {
            this.showFlag = false;
        },
        addFood(target) {
            this.$root.eventHub.$emit('cartAdd', event.target);
            Vue.set(this.food, 'count', 1);
        },
        addFirst(event) {
            if(!event._constructed) { //阻止非vue触发的事件(这个时间是bscroll里面的，如果不存在这个属性,则为原生点击事件，不执行下面的函数)
                return;
            }
            this.$root.eventHub.$emit('cartAdd', event.target);
            Vue.set(this.food, 'count', 1); //设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开 Vue 不能检测属性被添加的限制。
        },
        selectRating(type) {
            this.selectType = type;
            this.$nextTick(() => {
            this.scroll.refresh(); //数据变化时，重新定向BSscroll
            });
        },
        toggleContent() {
            this.onlyContent = !this.onlyContent;
            this.$nextTick(() => {
            this.scroll.refresh();
            });
        },
        needShow(type,text) {
            if(this.onlyContent && !text) return false;
            if(this.selectType === ALL) return true;
            else return type === this.selectType
        }
    },
    filters: {
        formatDate(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm') //公共方法
        }
    },
    components: {
        cartcontrol,
        split,
        ratingselect
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../common/sass/mixins";

.food{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 47px;
    width: 100%;
    background: #fff;
    z-index: 30;
    &.move-enter-active,
    &.move-leave-active{
        transition: all 0.2s linear;
        transform: translate3d(0,0,0);
    }
    &.move-enter,
    &.move-leave-to{
        transition: all 0.2s linear;
        transform: translate3d(100%,0,0);
    }
    .image-header{
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 100%; //此处padding是根据宽计算的，所以是正方形的盒子
        img{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .back{
            position: absolute;
            top: 10px;
            left: 0;
            .icon-arrow_lift{
                display: block;
                padding: 18px;
                font-size: 20px;
                color: #fff;
            }
        }
    }
    .content{
        padding: 18px;
        position: relative;
        .title{
            line-height: 14px;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(7, 17, 27);
        }
        .detail{
                line-height: 10px;
                margin-bottom: 18px;   
                font-size: 0px;
                .sell-count,.rating{
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .sell-count{
                    margin-right: 12px;
                }
        }
        .price {
            font-weight: 700;
            line-height: 24px;
            font-size: 0;
            .now {
              font-size: 14px;
              margin-right: 8px;
              color: rgb(240, 20, 20);
            }
            .old {
              font-size: 10px;
              color: rgb(174, 153, 159);
              text-decoration: line-through;
            }
          }
        .cartcontrol-wrapper{
            position: absolute;
            right: 12px;
            bottom: 12px;
        }
        .buy{
            line-height: 24px;
            padding: 0 12px;
            position: absolute;
            right: 18px;
            bottom: 18px;
            z-index: 10;
            box-sizing: border-box;
            font-size: 10px;
            border-radius: 12px;
            color: #fff;
            background: rgb(0, 160, 220);
            transition: all 0.2s;
            &.fade-enter-active,
            &.fade-leave-active{
                transition: all 0.2s;
                opacity: 0;
            }
            &.fade-enter,
            &.fade-leave-to{
                opacity: 0;
            }
        }
    }
    .info{
        padding: 18px;
        .title{
            height: 14px;
            line-height: 14px;
            margin-bottom: 6px;
            font-size: 14px;
            color: rgb(7, 17, 27);
        }
        .text{
            line-height: 24px;
            padding: 0 8px;
            font-size: 12px;
            color: rgb(77, 85, 93);
        }
    }
    .rating{
        padding-top: 18px;
        .title{
            height: 14px;
            line-height: 14px;
            margin-left: 18px;
            font-size: 14px;
            color: rgb(7, 17, 27); 
        }
        .rating-wrapper{
            padding: 0 18px;
            .rating-item{
                position: relative;
                padding: 16px 0;
                @include border-1px(rgba(7, 17, 27, 0.1));
                .user{
                    position: absolute;
                    right: 0;
                    top: 16px;
                    font-size: 0;
                    line-height: 12px;
                    .name{
                        margin-right: 6px;
                        line-height: 12px;
                        display: inline-block;
                        vertical-align: top;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .avatar{
                        border-radius: 50%
                    }
                }
                .time{
                    margin-bottom: 6px;
                    line-height: 12px;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .text{
                    line-height: 16px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                    .icon-thumb_up,.icon-thumb_down{
                        line-height: 16px;
                        margin-right: 4px;
                        font-size: 12px;
                    }
                    .icon-thumb_up{
                        color: rgb(0, 160, 220);
                    }
                    .icon-thumb_down{
                        color: rgb(147, 153, 159);
                    }
                }
            }
            .no-rating{
                padding: 16px 0;
                font-size: 12px;
                color: rgb(147, 153, 159);
            }
        }
    }
}
</style>
