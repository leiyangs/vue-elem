<template>
    <div class="ratingSelect">
        <div class="rating-type border-1px">
            <span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
            <span class="icon-check_circle"></span>
            <span class="text">只看内容的评价</span>
        </div>
    </div>
</template>

<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
    props: {
        ratings: {
            type: Array,
            default() {
                return [];
            }
        },
        selectType: {  //选择状态
            type: Number,
            default: ALL 
        },
        onlyContent: { //只看内容评价开关
            type: Boolean,
            default: false
        },
        desc: {  //不同状态text
            type: Object,
            default() {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }
        }
    },
    methods: {
        select(type, event) {
            if(!event._constructed) return;
            this.$emit('select', type); //直接绑到$emit 和通过eventHub效果一样
        },
        toggleContent(event) {
            if(!event._constructed) return;
            this.$emit('toggle');
            this.$root.eventHub.$emit('toggle'); //通过eventHub中介绑定
        }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/sass/mixins";
    .ratingSelect{
        .rating-type{
            font-size: 0;
            padding: 18px 0;
            margin: 0 18px;
            @include border-1px(rgba(7, 17, 27, 0.1));
            .block{
                display: inline-block;
                padding: 8px 12px;
                border-radius: 1px;
                margin-right: 8px;
                font-size: 12px;
                color: rgb(77, 85, 93);
                &.active{
                    color: #fff;
                }
                .count{
                    margin-left: 2px;
                    line-height: 16px;
                    font-size: 8px;
                }
                &.positive{
                    background: rgba(0, 160, 220, 0.2);
                    &.active{
                        background: rgb(0, 160, 220);
                    }
                }
                &.negative{
                    background: rgba(77, 85, 93, 0.2);
                    &.active{
                        background: rgb(77, 85, 93);
                    }
                }
            }
        }
        .switch{
            padding: 12px 18px;
            line-height: 24px;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            color: rgb(147, 153, 159);
            font-size: 0;
            &.on{
                .icon-check_circle{
                    color: #00c850;
                }
            }
            .icon-check_circle{
                display: inline-block;
                vertical-align: top;
                font-size: 24px;
                margin-right: 4px;
            }
            .text{
                display: inline-block;
                vertical-align: top;
                font-size: 12px;
            }
        }
    }
</style>
