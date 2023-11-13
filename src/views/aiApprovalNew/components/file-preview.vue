<template>
  <div class="file-preview">
    <!-- <div class="header">
      <p class="header-total">
        <span class="header-count">共 {{ activeIndex + 1 }}/<label style="font-size: 12px;">{{ files.length }}</label>
        </span>
        <span class="header-btns">
          <i class="iconfont" @click="saveFile">&#xe62e;</i>
          <i class="iconfont" @click="fullScreen">&#xe62f;</i>
          <i class="iconfont" @click="imgEditorShow">&#xe65b;</i>
        </span>
      </p>
      <div class="file-header-swiper">
        <div class="swiper swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(file, i) in files" :key="file.fileName + i" :class="{
              'swiper-slide-img': ['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName)),
              'swiper-slide-split': showSplit(i)
            }">
              <div class="slide" @click="changeFile(i)" :class="{ active: i === activeIndex }">
                <el-tooltip placement="bottom-start">
                  <div slot="content">{{ file.fileName }}</div>
                  <el-image v-if="['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName))" :src="file.url"></el-image>
                  <file-type v-else :fileName="file.fileName"></file-type>
                  是否为压缩包
                  <svg class="icon icon-zip" aria-hidden="true" v-if="file.zip">
                    <use xlink:href="#icon-zip"></use>
                  </svg>
                </el-tooltip>
              </div>
              是否显示分割线
              <label class="swiper-split" v-if="showSplit(i)"></label>
            </div>
          </div>
        </div>
        <div class="swiper-button-prev" :class="{ 'disabled': activeIndex === 0 }" @click="swiperTo(activeIndex - 1)">
        </div>
        <div class="swiper-button-next" :class="{ 'disabled': activeIndex === files.length - 1 }"
          @click="swiperTo(activeIndex + 1)"></div>
      </div>
    </div> -->
    <div class="preview" :class="{ fullScreen: showFullScreen }">
      <!-- 全屏关闭按钮 -->
      <i class="el-icon-circle-close" v-show="showFullScreen" @click="fullScreen"></i>
      <!-- 图片 -->
      <imgae-preview @getProps="getProps" ref="imgPreview" v-if="['jpeg', 'jpg', 'png', 'pdf'].includes(getfileType(approval.fileName))"
        :lineWordItem="lineWordItem" @findIconPosition="findIconPosition" @linePosition="linePosition" @showFullScreen="fullScreen" :url="approval.url"></imgae-preview>
      <!-- 其他类型文件 -->
      <filePreview v-else :url="approval.url"></filePreview>
      <div class="tool" v-if="(['jpeg', 'jpg', 'png'].includes(getfileType(approval.fileName))) && toolView">
        <span @click="saveFile">
          <i><img src="@/assets/image/ai-approval/download-white.png" alt=""></i>
          下载</span>
        <span @click="fullScreen">
          <i><img src="@/assets/image/ai-approval/fullscreen.png" alt=""></i>
          全屏</span>
        <span @click="changeSize(1)">
          <i><img src="@/assets/image/ai-approval/size-up.png" alt=""></i>
          放大</span>
        <span @click="changeSize(0)">
          <i><img src="@/assets/image/ai-approval/size-down.png" alt=""></i>
          缩小</span>
          <span @click="changeSize(2)">
          <i><img src="@/assets/image/ai-approval/reset.png" alt=""></i>
          恢复</span>
      </div>
    </div>
    <el-dialog class="imgEditor" title="图片编辑" width="1200px" :visible.sync="imgEditorDialogVisible">
      <imgEditor :url="approval.url" @saveImg="upDateImg"></imgEditor>
    </el-dialog>
  </div>
</template>

<script>
import 'swiper/css/swiper.css'
import Swiper from 'swiper'
// import fileType from '@/components/common/file-type'
import filePreview from '@/components/filePreview'
// import imgEditor from './image-editor'
import imgaePreview from './imgae-preview'
export default {
  components: { imgaePreview, filePreview, },
  name: 'file-preview',
  props: {
    approval: {
      type: Object,
      default: () => ({})
    },
    files: {
      type: Array,
      default: () => ([])
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    lineWordItem: {
      type: [Object, Array],
      default: () => ({})
    },
    formId: {
      type: String,
      default: () => ''
    },
    toolView: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imgEditorDialogVisible: false,
      swiper: null,
      showFullScreen: false,
    }
  },
  computed: {
    getfileType() {
      return val => {
        return val?.split('.')[val.split('.').length - 1]
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
  created() {
  },
  mounted() {
    // this.init();
    // this.imgLoad()
  },
  watch: {
  },
  methods: {
    changeSize(type) {
      this.$refs.imgPreview.changeSize(type)
    },
    upDateImg(img) {
      this.approval.url = img
      this.imgEditorDialogVisible = false
    },
    imgEditorShow() {
      this.imgEditorDialogVisible = true
    },
    saveFile() {
      this.$emit('saveFile');
    },
    getProps(val) {
      this.$emit('getProps', val);
    },
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
    // 切换审批文件
    changeFile(i) {
      this.$emit('changeFile', i)
    },
    swiperTo(i) {
      if (i >= 0 && i <= this.files.length - 1) {
        this.swiper.slideTo(i);
        this.changeFile(i)
      }
    },
    linePosition() {
      this.$emit('linePosition')
    },
    fullScreen() {
      this.showFullScreen = !this.showFullScreen;
      this.$nextTick(() => {
        this.$refs.imgPreview.handleImageLoaded()
      })
    },
    findIconPosition() {
      // this.$emit('findIconPosition')
      this.$emit('findIconPosition')
    },
    imgLoad() {
      this.$refs.imgPreview.handleImageLoaded()
    },
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
        width: 100%;
      }

      &.swiper-slide-split {
        width: 68px;
      }

      .slide {
        width: 60px;
      }
    }

    .active.slide {
      border: 1px solid #306EF5;
      box-shadow: 0px 0px 10px 0px #3E72EF66;
      opacity: 1;
    }

    &+.swiper-slide {
      margin-left: 6px;
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

.preview {
  overflow: auto;
  background: #ffffff;
  flex: 1;
  position: relative;
}

.fullScreen {
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgb(0 0 0 / 23%);

  .preview {
    // background: rgb(0 0 0 / 23%);
    background: none;
    margin: 30px;
    width: calc(100% - 60px);
    height: calc(100% - 60px);
  }
  /deep/ .tool{
    display: none;
  }
  .el-icon-circle-close {
    position: absolute;
    font-size: 30px;
    color: #ffffff;
    right: 20px;
    top: 20px;
    z-index: 1;
    cursor: pointer;
  }

  iframe {
    width: calc(100% - 80px);
    margin-left: 40px;
  }
}
.imgEditor{
  /deep/ .el-dialog__body{
    height: 72vh;
  }
}
.tool{
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  z-index: 1;
  width: 275px;
  box-shadow: 0px 0px 10px 0px #4343431A;
  height: 38px;
  border-radius: 8px;
  background-color: #1D2128BF;
  span{
    i{
      margin-right: 2px;
      img{
        width: 16px;
        height: 16px;
      }
    }
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #FFFFFF;
  }
}
</style>
