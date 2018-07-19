<template>
    <div class="star" :class="starType">
        <span :key="index" v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item"></span>
    </div>
</template>

<script type="text/ecmascript-6">
    const len = 5; //星星数量
    const star_on = 'on'; //状态 满星
    const star_half = 'half'; //状态 半星
    const star_off = 'off'; //状态 灰色星

    export default {
        props: {
            size: {
                type: Number
            },
            score: {
                type: Number //返回数据 星星数量
            }
        },
        computed: {
            starType() {
                return `star-${this.size}`;
            },
            itemClasses() {
                let result = []; //放星星状态的数组
                let score = Math.floor(this.score * 2) / 2; //可计算出是否有小数 假如score为2.9 Math.floor(this.score * 2) / 2 => 2.5; Math.floor(this.score) => 2;
                let decimal = score % 1 !== 0; //如果有小数 赋值
                let integer = Math.floor(score);
                for(let i = 0;i<integer; i++) {
                    result.push(star_on);
                }
                if(decimal) {
                    result.push(star_half);
                }
                while (result.length < len) {
                    result.push(star_off);
                }
                return result;
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scope>
    @import "../../common/sass/mixins";
    
    .star{
        display:inline-block;
        .star-item{
            display: inline-block;
            background-repeat: no-repeat;
        }
        &.star-48{
            .star-item{
                width: 20px;
                height: 20px;
                margin-right: 22px;
                background-size: 20px 20px;
                &:last-child{
                    margin-right: 0;
                 }
                &.on{
                    @include bg-img(star48_on);
                 }
                &.half{
                    @include bg-img(star48_half);
                 }

                &.off {
                    @include bg-img(star48_off)
                 }
            }
         }
        &.star-36{
            .star-item{
                width: 15px;
                height: 15px;
                margin-right: 6px;
                background-size: 15px 15px;
                &:last-child{
                     margin-right: 0;
                 }
                &.on{
                    @include bg-img(star36_on);
                 }
                &.half{
                    @include bg-img(star36_half);
                 }
                &.off{
                    @include bg-img(star36_off);
                 }
            }
         }
        &.star-24{
            .star-item{
                width: 10px;
                height: 10px;
                margin-right: 3px;
                background-size: 10px 10px;
                &:last-child{
                     margin-right: 0;
                 }
                &.on{
                    @include bg-img(star24_on);
                 }
                &.half{
                    @include bg-img(star24_half);
                 }
                &.off{
                    @include bg-img(star24_off);
                 }
            }
         }
    }
</style>
