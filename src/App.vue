<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <ul class="tab">
            <li class="tab-item">
                <router-link to="/goods">商品</router-link>
            </li>
            <li class="tab-item">
                <router-link to="/ratings">评价</router-link>
            </li>
            <li class="tab-item">
                <router-link to="/seller">商家</router-link>
            </li>
        </ul>
        <keep-alive>
            <router-view :seller="seller"></router-view>
        </keep-alive>
    </div>
</template>

<script type="text/ecmascript-6">
    import header from '@/components/header/header';
    import { urlParse } from '@/common/js/util'

    const ERR_OK = 0;

    export default {
        data: function() {
            return {
                seller: {
                    id: (() => {
                        let queryParam = urlParse();
                        return queryParam.id;
                    })()
                }
            };
        },
        created() {
          this.axios.get('/api/seller?id='+this.seller.id).then((response) => {
            response = response.data; // resoce中.body返回object
            if(response.errno === ERR_OK) {
                // this.seller = response.data;
                this.seller = Object.assign({}, this.seller, response.data); //为obj添加属性 第一个参数是目标对象，后面的都是源对象
            }
          });
        },
        components: {
            'v-header': header
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scope>
    @import "common/sass/mixins";

    #app {

        .tab {
            display: flex;
            width: 100%;
            height: 40px;
            line-height: 40px;
            @include border-1px(rgba(7, 17, 27, 0.1));
            .tab-item {
                flex: 1;
                text-align: center;
                & > a {
                    display: block;
                    font-size: 14px;
                        color: rgb(77, 85, 93);
                        &.active {
                            color: rgb(240, 20, 20);
                        }
                    }
            }
        }

    }
</style>
