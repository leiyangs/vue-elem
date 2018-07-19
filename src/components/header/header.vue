<template>
    <header class="header">
        <div class="content-wrapper">
            <div class="headImg">
                <img :src="seller.avatar" alt="" width="64" height="64">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div class="support" v-if="seller.supports">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div class="seller-support" v-if="seller.supports" @click="showDetail">
                <span class="count">{{seller.supports.length}}</span>
                <i class="icon-keyboard_arrow_right icon"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right icon"></i>
        </div>
        <div class="bg-img">
            <img :src="seller.avatar" alt="" width="100%" height="100%">
        </div>
        <!-- 公告浮层 -->
        <transition name="fade">
            <div class="detail" v-show="detailShow">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <div class="title-wrapper">
                            <div class="line"></div>
                            <div class="title">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <!-- 优惠信息 -->
                        <ul v-if="seller.supports" class="supports">
                            <li class="support-item" :key="item.index" v-for="(item,index) in seller.supports">
                                <i class="icon" :class="classMap[seller.supports[index].type]"></i>
                                <span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>
                        <!-- 商家公告 -->
                        <div class="title-wrapper">
                            <div class=line></div>
                            <div class="title">商家公告</div>
                            <div class=line></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="showDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </header>
</template>

<script type="text/ecmascript-6">
import star from "@/components/star/star";

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      detailShow: false
    };
  },
  methods: {
    showDetail() {
      this.detailShow = !this.detailShow;
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  },
  components: {
    star
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scope>
@import "../../common/sass/mixins";

.header {
  color: #fff;
  background: rgba(7, 17, 27, 0.5);
  position: relative;
  overflow: hidden;
  .content-wrapper {
    padding: 24px 24px 18px 12px;
    position: relative;
    font-size: 0;
    .headImg {
      margin-right: 16px;
      display: inline-block;
      vertical-align: top;
      img {
        border-radius: 2px;
      }
    }
    .content {
      display: inline-block;
      .title {
        margin: 2px 0 8px 0;
        .brand {
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          @include bg-img(brand);
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }
        .name {
          display: inline-block;
          vertical-align: top;
          margin-left: 6px;
          font-size: 16px;
          font-weight: bold;
          line-height: 18px;
        }
      }
      .description {
        font-size: 12px;
        line-height: 12px;
        margin-bottom: 10px;
      }
      .support {
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 4px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-img(decrease_1);
          }
          &.discount {
            @include bg-img(discount_1);
          }
          &.guarantee {
            @include bg-img(guarantee_1);
          }
          &.invoice {
            @include bg-img(invoice_1);
          }
          &.special {
            @include bg-img(special_1);
          }
        }
        .text {
          display: inline-block;
          vertical-align: top;
          font-size: 10px;
          font-weight: 200;
          line-height: 16px;
        }
      }
    }
    .seller-support {
      height: 24px;
      line-height: 24px;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.2);
      text-align: center;
      position: absolute;
      right: 12px;
      bottom: 14px;
      padding: 0 8px;
      .count {
        font-size: 10px;
      }
      .icon {
        font-size: 10px;
        line-height: 24px;
        margin-left: 2px;
      }
    }
  }
  .bulletin-wrapper {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 22px 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(7, 17, 27, 0.2);
    .bulletin-title {
      display: inline-grid;
      vertical-align: top;
      margin-top: 8px;
      width: 22px;
      height: 12px;
      @include bg-img(bulletin);
      background-size: 22px 12px;
      background-repeat: no-repeat;
    }
    .bulletin-text {
      vertical-align: top;
      margin: 0 4px;
      font-size: 10px;
    }
    .icon {
      position: absolute;
      top: 8px;
      right: 12px;
      font-size: 10px;
    }
  }
  .bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }
  .detail {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    transition: all 0.2s ease;
    background: rgba(7, 17, 27, 0.8);
    &.fade-enter-active,
    &.fade-leave-active {
      opacity: 1;
    }
    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
    }
    .detail-wrapper {
      min-height: 100%;
      width: 100%;
      .detail-main {
        margin-top: 64px;
        padding: 0 36px 64px;
        .name {
          font-size: 16px;
          font-weight: 700;
          height: 16px;
          line-height: 16px;
          text-align: center;
        }
        .star-wrapper {
          margin-top: 18px;
          text-align: center;
        }
        .title-wrapper {
          margin-top: 30px;
          margin-bottom: 24px;
          display: flex;
          .line {
            flex: 1;
            position: relative;
            top: -6px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          .title {
            padding: 0 12px 0;
            font-size: 14px;
            font-weight: 700;
          }
        }
        .supports {
          display: block;
          .support-item {
            padding: 0 12px 0 12px;
            margin-bottom: 12px;
            font-size: 0;
            &:last-child {
              margin-bottom: 0;
            }
            .icon {
              display: inline-block;
              width: 16px;
              height: 16px;
              vertical-align: top;
              margin-right: 6px;
              background-size: 16px 16px;
              background-repeat: no-repeat;
              &.decrease {
                @include bg-img(decrease_2);
              }
              &.discount {
                @include bg-img(discount_2);
              }
              &.guarantee {
                @include bg-img(guarantee_2);
              }
              &.invoice {
                @include bg-img(invoice_2);
              }
              &.special {
                @include bg-img(special_2);
              }
            }
            .text {
              font-size: 12px;
              font-weight: 200;
              line-height: 12px;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
        .bulletin {
          padding: 0 12px 0 12px;
          .content {
            font-size: 12px;
            font-weight: 200;
            line-height: 24px;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
    .detail-close {
      position: relative;
      width: 32px;
      height: 32px;
      margin: -64px auto 0 auto;
      font-size: 32px;
      clear: both;
    }
  }
}
</style>
