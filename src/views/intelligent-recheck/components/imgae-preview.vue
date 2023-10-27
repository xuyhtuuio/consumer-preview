<template>
  <div class="preview" v-loading="!loaded">
    <div class="preview" v-show="!editImg" ref="contentDom">
      <img id="picture" @click="fullImage" :src="url" @load="handleImageLoaded" ref="imgDom" />
    </div>
    <vueCropper
      v-if="editImg"
      ref="cropper"
      :img="url"
      @realTime="imgLoad"
      :outputSize="option.outputSize"
      :outputType="option.outputType"
      :info="option.info"
      :canScale="option.canScale"
      :autoCrop="option.autoCrop"
      :autoCropWidth="option.autoCropWidth"
      :autoCropHeight="option.autoCropHeight"
      :fixedBox="option.fixedBox"
      :canMove="option.canMove"
      :canMoveBox="option.canMoveBox"
      :original="option.original"
      :centerBox="option.centerBox"
      :infoTrue="option.infoTrue"
      :full="option.full"
      :enlarge="option.enlarge"
      :mode="option.mode"
    ></vueCropper>
    <div class="edit-btn" @click="changeEdit" v-if="showEdit">
      <img v-if="!editImg" src="@/assets/image/intelligent-recheck/edit-no.png" alt="" />
      <img v-else src="@/assets/image/intelligent-recheck/edit-yes.png" alt="" />
    </div>
    <div class="edit-success" v-if="editImg" @click="changeEditImg">
      <img class="blur" style="width: 25px" src="@/assets/image/intelligent-recheck/edit-show.png" alt="" />
      <img class="focus" src="@/assets/image/intelligent-recheck/edit-success.png" alt="" />
      <div class="tip-edit">完成</div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { getFormGroups } from '@/api/front'
const paramsInit = Object.freeze({
  zoomVal: 1,
  left: 0,
  top: 0,
  currentX: 0,
  currentY: 0,
  flag: false,
  borderLeft: 0,
  borderRight: 0,
  borderTop: 0,
  borderBottom: 0,
  moved: false
})
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    showEdit: {
      type: Boolean,
      default: true
    }
  },
  components: {
    VueCropper
  },
  data() {
    return {
      loaded: false,
      editImg: false,
      option: {
        // 裁剪图片的地址 url 地址, base64, blob
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式 jpeg, png, webp
        info: true, // 裁剪框的大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 0, // 默认生成截图框宽度
        autoCropHeight: 0, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        canMove: true, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        full: true, // 是否输出原图比例的截图
        enlarge: '1', // 图片根据截图框输出比例倍数
        mode: 'contain' // 图片默认渲染方式 contain , cover, 100px, 100% auto
      }
    }
  },
  watch: {
    url() {
      this.loaded = false
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleImageLoaded)
  },
  methods: {
    fullImage() {
      this.$emit('fullImage');
    },
    changeEdit() {
      this.editImg = !this.editImg;
    },
    imgLoad(res) {
      this.option.autoCropHeight = res.img.height.replace('px', '')
      this.option.autoCropWidth = res.img.width.replace('px', '')
    },
    changeEditImg() {
      this.$refs.cropper.getCropBlob(data => {
        const file = new File([data], '截图检索' + new Date().getTime() + '.png');
        this.uploadFile(file);
      })
    },
    uploadFile(param) {
      const formData = new FormData()
      this.uploading = true;
      this.$message.info('上传中，请稍等！')
      formData.append('mf', param) // 传入bpmn文件
      getFormGroups(formData)
        .then((res) => {
          if (res.data.success) {
            this.uploading = false
            this.$router.push({
              name: 'recheck-detail',
              params: {
                ...res.data.data,
                name: '',
                text: ''
              },
            })
            this.editImg = false;
            this.$emit('changeImgFun', {
              ...res.data.data,
              name: '',
              text: ''
            });
          } else {
            this.$message.error(res.data.msg)
            this.uploading = false
          }
        })
        .catch(() => {
          this.uploading = false
          this.$message.error('上传失败')
        })
    },
    linePosition() {
      this.setBoundingClientRect(this.lineWordItem)
      this.$nextTick(() => {
        this.$emit('linePosition')
      })
    },
    // 获取局部高亮样式(当前缩放时定位不准)
    setBoundingClientRect(val) {
      if (val?.word) {
        this.BoundingClientRect = {
          width: this.$refs.imgDom.clientWidth + 'px',
          height: this.$refs.imgDom.clientHeight + 'px',
          left: parseInt(this.params.left, 10) + 'px',
          top: parseInt(this.params.top, 10) + 'px',
          transform: `scale(${this.params.zoomVal})`
        }
        if (val.isComment) {
          this.highLightBoundingClientRect = {
            width: val?.location.w + 'px',
            height: val?.location.h + 'px',
            left: val?.location.x + 'px',
            top: val?.location.y + 'px',
          }
        } else {
          this.highLightBoundingClientRect = {
            width: val?.location.w * this.scale + 'px',
            height: val?.location.h * this.scale + 'px',
            left: val?.location.x * this.scale + 'px',
            top: val?.location.y * this.scale + 'px',
          }
        }
      }
    },
    // 当高亮为多个时
    setBoundingClientRectArr(val) {
      const highLightStyles = []
      this.BoundingClientRect = {
        width: this.$refs.imgDom.clientWidth + 'px',
        height: this.$refs.imgDom.clientHeight + 'px',
        left: parseInt(this.params.left, 10) + 'px',
        top: parseInt(this.params.top, 10) + 'px',
        transform: `scale(${this.params.zoomVal})`
      }
      val.map((hls) => {
        const h = {
          width: hls?.location.w + 'px',
          height: hls?.location.h + 'px',
          left: hls?.location.x + 'px',
          top: hls?.location.y + 'px',
        }
        highLightStyles.push(h)
      })
      this.highLightStyles = highLightStyles
    },
    // 图片加载完后,初始化
    handleImageLoaded() {
      this.$refs.imgDom.style.left = '0px'
      this.$refs.imgDom.style.top = '0px'
      this.params = JSON.parse(JSON.stringify(paramsInit))
      this.loaded = true;
      this.naturalWidth = this.$refs.imgDom.naturalWidth;
      this.naturalHeight = this.$refs.imgDom.naturalHeight;
      this.scale = this.$refs.imgDom.clientWidth / this.$refs.imgDom.naturalWidth;
      this.getMaxPosition()
      this.initCenter()
    },
    // 计算出允许拖拽的最大偏移量
    getMaxPosition() {
      const { params } = this;
      if (this.$refs.imgDom.clientHeight <= 0) {
        return;
      }
      // 左右边距
      const borderLeft = ((params.zoomVal - 1) * this.$refs.imgDom.clientWidth) / 2;
      const borderRight = this.$refs.contentDom.clientWidth - this.$refs.imgDom.clientWidth - borderLeft;
      let topArr = [borderLeft, borderRight];
      this.params.borderLeft = Math.max.apply(null, topArr)
      this.params.borderRight = Math.min.apply(null, topArr)
      // 上下边距
      const borderTop = ((this.params.zoomVal - 1) * this.$refs.imgDom.clientHeight) / 2;
      const borderBottom = this.$refs.contentDom.clientHeight - this.$refs.imgDom.clientHeight - borderTop;
      topArr = [borderTop, borderBottom];
      this.params.borderTop = Math.max.apply(null, topArr)
      this.params.borderBottom = Math.min.apply(null, topArr)
    },
    // 初始化图片中心
    initCenter() {
      const { params } = this;
      const target = this.$refs.imgDom;
      if (params.borderLeft !== params.borderRight) {
        // 调整左右位置
        target.style.left = (params.borderLeft / 2) + 'px';
      }
      if (params.borderTop !== params.borderBottom) {
        // 调整上下位置
        target.style.top = (params.borderTop / 2) + 'px';
      }
      if (this.getCss(target, 'left') !== 'auto') {
        this.params.left = this.getCss(target, 'left');
      }
      if (this.getCss(target, 'top') !== 'auto') {
        this.params.top = this.getCss(target, 'top');
      }
      target.style.transform = 'scale(1)';
      this.$emit('getProps', {
        height: target.height,
        width: target.width,
        style: target.style,
        wordDomStyle: this.wordDomStyle
      })
    },
    // 获取相关CSS属性
    getCss(o, key) {
      return o.currentStyle
        ? o.currentStyle[key]
        : document.defaultView.getComputedStyle(o, false)[key];
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleImageLoaded)
  }
}
</script>
<style lang="less" scoped>
.preview {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: scroll;
  position: relative;
  cursor: zoom-in;
  img {
    position: absolute;
    left: 0;
    height: auto;
    max-width: 100%;
    // max-height: 100%;
  }
  /deep/.vue-cropper {
    background: #fff;
  }
}

.edit-btn {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 100;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #f2f3f5;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);
  padding: 6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    position: relative;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}
.edit-success {
  padding: 6px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #E5E6EB;
  background: #FFF;
  box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.10);
  cursor: pointer;
  z-index: 10;
  img {
    position: relative;
    width: 24px;
    height: 24px;
    margin-right: 4px;
  }
  .tip-edit {
    color: #505968;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
  .blur {
    display: block;
  }
  .focus {
    display: none;
  }
}
.edit-success:hover {
  padding-left: 7px;
  .blur {
    display: none;
  }
  .focus {
    display: block;
  }
}
</style>
