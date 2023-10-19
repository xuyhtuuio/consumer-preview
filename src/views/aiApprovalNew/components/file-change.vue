<template>
  <div class="file-change">
    <div class="file-header-swiper">
      <div class="swiper-button-prev" :class="{ 'disabled': activeIndex === 0 }" @click="swiperTo(activeIndex - 1)">
      </div>
      <div class="swiper swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(file, i) in fileList" :key="file.fileName + i" :class="{
            'swiper-slide-img': ['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName)),
            'swiper-slide-split': showSplit(i)
          }">
            <div class="slide" @click="changeFile(i)" :class="{ active: i === activeIndex }">
              <el-tooltip placement="bottom-start">
                <div slot="content">{{ file.fileName }}</div>
                <el-image v-if="['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName))" :src="file.url"></el-image>
                <file-type v-else :fileName="file.fileName"></file-type>
                <!-- 是否为压缩包 -->
                <svg class="icon icon-zip" aria-hidden="true" v-if="file.zip">
                  <use xlink:href="#icon-zip"></use>
                </svg>
              </el-tooltip>
            </div>
            <!-- 是否显示分割线 -->
            <label class="swiper-split" v-if="showSplit(i)"></label>
          </div>
        </div>
      </div>
      <div class="swiper-button-next" :class="{ 'disabled': activeIndex === fileList.length - 1 }"
        @click="swiperTo(activeIndex + 1)"></div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'

import fileType from '@/components/common/file-type'

export default {
  name: 'fileChange',
  components: {
    fileType
  },
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
    }
  },
  created() {
    this.init()
  },
  computed: {
    getfileType() {
      return val => {
        return val?.split('.')[val.split('.').length - 1]
      }
    },
    getfileName() {
      return val => {
        return val?.split('.')[0]
      }
    },
    showSplit() {
      return i => {
        const isEnd = i + 1 !== this.fileList.length && this.fileList[i].zip && this.fileList?.[i + 1]?.zip !== this.fileList[i].zip
        const isStart = i !== 0 && this.fileList?.[i + 1]?.zip && this.fileList?.[i + 1]?.zip !== this.fileList[i].zip
        return isEnd || isStart;
      }
    },
  },
  methods: {
    // 初始化
    init() {
      this.swiper = new Swiper('.swiper-container', {
        // navigation: { // 如果需要前进后退按钮
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev'
        // },
        slidesPerView: 'auto',
        on: {
          resize() {
            this.update();
          },
        },
      })
      this.swiper.on('slideChange', () => {
        this.changeFile(this.activeIndex)
        setTimeout(() => {
          this.swiper.update()
        }, 1000);
      });
    },
    changeFile(i) {
      this.$emit('changeFile', i)
    },
    swiperTo(i) {
      if (i >= 0 && i <= this.fileList.length - 1) {
        this.swiper.slideTo(i);
        this.changeFile(i)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.file-change {
  display: flex;
  width: 60px;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  /deep/ .file-header-swiper {
      position: relative;
      padding: 0 8px;
      height: 518px;
      display: flex;
      align-items: center;
      padding: 40px 0px;
      .swiper-container {
        overflow: auto;
        height: 438px;
        margin: 40px 0px;
        width: 60px;
        .swiper-wrapper{
          display: flex;
          flex-direction: column;
        }
      }
      .swiper-button-prev {
        position: absolute;
        background: #707EA8;
        border-radius: 50%;
        color: #ffffff;
        top: 40px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
      .swiper-button-next {
        top: unset;
        position: absolute;
        background: #707EA8;
        border-radius: 50%;
        color: #ffffff;
        bottom: 10px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
      .swiper-button-disabled {
        background: #CACDD3;
        cursor: not-allowed;
      }

      .swiper-button-next:after,
      .swiper-button-prev:after {
        line-height: 24px !important;
        font-size: 12px;
        font-weight: 700;
      }

      .swiper-button-next {
        left: 50%;
        transform: rotate(90deg);
        margin-left: -12px;

        &.disabled {
          background: #CACDD3;
          cursor: not-allowed;
        }
      }

      .swiper-button-prev {
        left: 50%;
        transform: rotate(90deg);
        margin-left: -12px;
        &.disabled {
          background: #CACDD3;
          cursor: not-allowed;
        }
      }

      .swiper-slide {
        margin-top: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;

        &-split {
          width: 44px;
        }

        .swiper-split {
          display: inline-block;
          width: 2px;
          height: 24px;
          background: #707EA8;
          position: relative;
          top: -8px;
        }

        .slide {
          background: #FFFFFF;
          opacity: .4;
          width: 36px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          text-align: center;
          display: inline-block;
        }

        i {
          font-size: 36px;
        }

        &-img {

          .el-image {
            height: 100%;
            width: 100%;
          }

          &.swiper-slide-split {
            width: 68px;
          }

          .slide {
            width: 36px;
          }
        }

        .active.slide {
          border: 1px solid #306EF5;
          box-shadow: 0px 0px 10px 0px #3E72EF66;
          opacity: 1;
        }

        &+.swiper-slide {
          margin-left: 0px;
        }

        .icon {
          width: 100%;
          height: 100%;
        }

        .icon-zip {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 10px;
          width: 20px;
          height: 10px;
        }
      }

      [class="icon-*"] {
        font-size: 36px;
      }

      .icon-mianxingtubiao {
        color: #E94848;
      }

      .icon-mianxingtubiao-1 {
        color: #5BBFC2;
      }

      .icon-mianxingtubiao-2 {
        color: #306EF5;
      }
    }
}
</style>
