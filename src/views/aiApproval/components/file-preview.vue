<template>
  <div class="file-preview">
    <div class="header">
      <p class="header-total">
        <span class="header-count">共 {{ activeIndex + 1 }}/{{ files.length }}</span>
        <span class="header-btns">
          <i class="iconfont">&#xe62e;</i>
          <i class="iconfont">&#xe62f;</i>
        </span>
      </p>
      <div class="file-header-swiper">
        <div class="swiper swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(file, i) in files" :key="i" :class="{
              'swiper-slide-img': ['jpeg', 'jpg', 'png'].includes(fileType(file.fileName)),
              'swiper-slide-active': i === activeIndex,
              'swiper-slide-split': showSplit(i)
            }">
              <div class="slide" @click="changeFile(i)">
                <img src="@/assets/image/ai-approval/Approval_fileType_pdf.png"
                  v-if="fileType(file.fileName) === 'pdf'" />
                <img src="@/assets/image/ai-approval/Approval_fileType_xls.png"
                  v-else-if="['xls', 'xlsx'].includes(fileType(file.fileName))" />
                <img src="@/assets/image/ai-approval/Approval_fileType_doc.png"
                  v-else-if="['doc', 'docx'].includes(fileType(file.fileName))" />
                <el-image v-else-if="['jpeg', 'jpg', 'png'].includes(fileType(file.fileName))" :src="file.url"></el-image>
                <!-- 是否为压缩包 -->
                <i class="iconfont icon-zip" v-if="file.zip"></i>
              </div>
              <!-- 是否显示分割线 -->
              <label class="swiper-split" v-if="showSplit(i)"></label>
            </div>
          </div>
        </div>
        <div class="swiper-button-prev" :class="{ 'disabled': activeIndex === 0 }" @click="swiperTo(activeIndex - 1)"></div>
        <div class="swiper-button-next" :class="{ 'disabled': activeIndex === files.length - 1 }"
          @click="swiperTo(activeIndex + 1)"></div>
      </div>
    </div>
    <div class="preview">
      <!-- 图片 -->
      <imgae-preview></imgae-preview>
      <!-- 其他类型文件 -->
    </div>
  </div>
</template>

<script>
import 'swiper/css/swiper.css'
import Swiper from 'swiper'
import imgaePreview from './imgae-preview'
export default {
  components: { imgaePreview },
  name: 'file-preview',
  props: {
    approval: {
      type: Object,
      default: () => ({})
    },
    files: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      swiper: null,
      activeIndex: 0,
    }
  },
  computed: {
    fileType() {
      return val => {
        return val.split('.')[1]
      }
    },
    showSplit() {
      return i => {
        const isEnd = i + 1 !== this.files.length && this.files[i].zip && this.files?.[i + 1]?.zip !== this.files[i].zip
        const isStart = i !== 0 && this.files?.[i + 1]?.zip && this.files?.[i + 1]?.zip !== this.files[i].zip
        return isEnd || isStart;
      }
    },
  },
  mounted() { },
  methods: {
    // 初始化
    init() {
      this.swiper = new Swiper('.swiper-container', {
        // navigation: { // 如果需要前进后退按钮
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev'
        // },
        slidesPerView: 'auto',
      })
    },
    // 切换审批文件
    changeFile(i) {
      this.activeIndex = i;
    },
    swiperTo(i) {
      if (i >= 0 && i <= this.files.length - 1) {
        this.swiper.slideTo(i);
        this.changeFile(i)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.file-preview {
  display: flex;
  flex-direction: column;
}

.header {
  background: #F7F8FA;
  padding: 12px 20px;

  &-total {
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
  }

  &-count {
    font-size: 14px;
    color: #1D2128;
    font-weight: bold;
  }

  &-btns {
    i {
      font-size: 18px;
      color: #505968;
      cursor: pointer;
    }

    i+i::before {
      content: ' ';
      width: 1px;
      height: 12px;
      display: inline-block;
      margin: 0 10px;
      background: #CACDD3;
      cursor: default;
    }
  }

}

/deep/ .file-header-swiper {
  position: relative;
  padding: 0 34px;

  .swiper-container {

    height: 40px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    position: absolute;
    background: #707EA8;
    border-radius: 50%;
    color: #ffffff;
    top: 30px;
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
    right: 0;

    &.disabled {
      background: #CACDD3;
      cursor: not-allowed;
    }
  }

  .swiper-button-prev {
    left: 0;

    &.disabled {
      background: #CACDD3;
      cursor: not-allowed;
    }
  }

  .swiper-slide {
    width: 36px;

    &-split {
      width: 44px;
    }

    .swiper-split {
      display: inline-block;
      width: 2px;
      height: 24px;
      background: #707EA8;
      margin-left: 6px;
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
      width: 60px;

      .el-image {
        height: 100%;
      }

      &.swiper-slide-split {
        width: 68px;
      }

      .slide {
        width: 60px;
      }
    }

    &-active .slide {
      border: 1px solid #306EF5;
      box-shadow: 0px 0px 10px 0px #3E72EF66;
      opacity: 1;
    }

    &+.swiper-slide {
      margin-left: 6px;
    }

    .icon-zip {
      position: absolute;
      left: 0;
      top: 0;
      color: #2D5CF6;
      font-size: 10px;
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

.preview {
  background: #ffffff;
  flex: 1;
}</style>
