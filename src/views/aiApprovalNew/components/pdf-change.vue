<template>
  <div class="pdf-change">
    <!-- <div @click="toggleOCR" class="btn-change">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-Frame3"></use>
      </svg>
      <div v-if="curMode === 2">OCR</div>
      <div v-else>原图</div>
    </div> -->
    <div class="file-header-swiper">
      <div class="swiper swiper-container">
        <div class="swiper-top">
          <div class="swiper-button-prev" :class="{ 'disabled': activeIndex === 0 }" @click="swiperTo(pdfPageNow - 1)">
          </div>
          <el-input v-model="curPdfPage" @keyup.enter.native="changePdfPageInput(curPdfPage)">
            <template slot="append">/{{ pdfTotal }}</template>
          </el-input>
          <div class="swiper-button-next" :class="{ 'disabled': activeIndex === fileList.length - 1 }"
            @click="swiperTo(pdfPageNow + 1)">
          </div>
        </div>
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(file, i) in fileList" :key="file.fileName + i" :class="{
            'swiper-slide-img': ['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName)),
            'swiper-slide-split': showSplit(i)
          }">
            <div class="slide" @click="changePdfPage(i)" :class="{ active: (i + (pdfPageSize * (pdfPageNow - 1))) === activeIndex }">
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
    pdfPageNow: {
      type: Number,
      default: 1
    },
    pdfPageSize: {
      type: Number,
      default: 10
    },
    pdfTotalPage: {
      type: Number,
      default: 0
    },
    pdfTotal: {
      type: Number,
      default: 0
    },
    fileList: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    curMode: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      curPdfPage: 1
    }
  },
  created() {
    this.init()
  },
  watch: {
    activeIndex(val) {
      this.curPdfPage = (val + 1)
    }
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
        this.changePdfPage(this.activeIndex)
        setTimeout(() => {
          this.swiper.update()
        }, 1000);
      });
    },
    changePdfPage(i) {
      const num = Number(i)
      if (num < 0 || num > 9) {
        this.curPdfPage = this.activeIndex
        return;
      }
      const index = num + (this.pdfPageNow - 1) * this.pdfPageSize
      this.$emit('changePdfPage', Number(index))
    },
    changePdfPageInput(i) {
      this.changePdfPage(i - 1)
    },
    swiperTo(pageNow) {
      if (pageNow < 1 || pageNow > this.pdfTotalPage) {
        return;
      }
      this.$emit('changePdfPageNow', pageNow)
    },
    toggleOCR() {
      const val = this.curMode === 1 ? 2 : 1
      this.$emit('toggleMode', val)
    }
  },
}
</script>

<style lang="less" scoped>
.pdf-change {
  display: flex;
  width: 60px;
  padding-top: 8px;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  .btn-change {
    cursor: pointer;
    display: flex;
    flex-direction: column;

    .icon {
      width: 24px;
      height: 24px;
    }

    div {
      color: #505968;
      font-size: 12px;
      font-weight: 400;
    }
  }

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
      width: 116px;

      .swiper-top {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 116px;
        padding: 0px 8px 0px 8px;

        .el-input {
          width: 60px;
          height: 28px;
          margin: 0px 4px;
          .el-input__inner{
            padding: 0px;
            height: 28px;
            padding-left: 10px;
            font-size: 14px;
            color: #1D2128;
            border: 1px #86909C solid;
            border-right: none;
          }
          .el-input-group__append {
            font-size: 15px;
            color: #88909B;
            height: 28px;
            border: 1px #86909C solid;
            border-left: none;
            width: 30px;
            padding: 0;
            background: #fff;
          }
        }
        .swiper-button-prev{
          position: static;
          display: inline-flex;
          width: 16px;
          height: 28px;
          margin-top: 0;
          color: #1D2128;
        }
        .swiper-button-next{
          position: static;
          display: inline-flex;
          width: 16px;
          height: 28px;
          margin-top: 0;
          color: #1D2128;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          line-height: 28px !important;
          display: inline-flex;
          justify-content: center;
          font-size: 12px;
          width: 16px;
          height: 28px;
          font-weight: 700;
        }
        .swiper-button-disabled {
          background: #CACDD3;
          cursor: not-allowed;
        }
      }

      .swiper-wrapper {
        display: flex;
        flex-direction: column;
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
}</style>
