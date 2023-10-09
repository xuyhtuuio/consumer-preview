<template>
  <div class="preview" ref="contentDom" v-loading="!loaded">
    <img id="picture" :src="url" @load="handleImageLoaded" ref="imgDom" />
    <div class="light" ref="light" v-if="lineWordItem?.word" :style="this.BoundingClientRect">
      <div class="light" id="imgLight" :style="this.highLightBoundingClientRect"></div>
    </div>
    <!-- <div class="tool">
      <span>下载</span>
      <span @click="fullScreen">全屏</span>
      <span @click="changeSize(1)">放大</span>
      <span @click="changeSize(0)">缩小</span>
    </div> -->
  </div>
</template>

<script>
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
    lineWordItem: {
      type: Object,
      default: () => ({})
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loaded: false,
      params: {},
      naturalHeight: 0,
      naturalWidth: 0,
      scale: 1,
      BoundingClientRect: {},
      highLightBoundingClientRect: {},
      wordDomStyle: {
        width: 0,
        height: 0,
        scale: 1,
      },
      zoomVal: 1,
    }
  },
  watch: {
    lineWordItem: {
      handler(val) {
        this.setBoundingClientRect(val)
      },
      // deep: true
    },
    url() {
      this.loaded = false;
      const target = this.$refs.imgDom
      target.style.left = '0px';
      target.style.top = '0px';
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleImageLoaded)
  },
  methods: {
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
        this.highLightBoundingClientRect = {
          width: val?.location.w * this.scale + 'px',
          height: val?.location.h * this.scale + 'px',
          left: val?.location.x * this.scale + 'px',
          top: val?.location.y * this.scale + 'px',
        }
      }
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
      const imgDomElement = document.getElementById('picture');
      this.wordDomStyle.width = imgDomElement.clientWidth;
      this.wordDomStyle.height = imgDomElement.clientHeight;
      this.wordDomStyle.scale = (imgDomElement.naturalWidth / imgDomElement.clientWidth).toFixed(2);
      this.getMaxPosition()
      this.initCenter()
      // 绑定缩放事件
      const content = this.$refs.contentDom
      content.removeEventListener('wheel', this.handleWheel)
      content.addEventListener('wheel', this.handleWheel)
      // 绑定拖拽
      this.startDrag()
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
    // 滚轮缩放事件
    handleWheel(event) {
      this.getMaxPosition()
      const { params } = this;
      this.params.zoomVal += -event.deltaY / 1200;
      if (params.zoomVal >= 0.2) {
        this.$refs.imgDom.style.transform = 'scale(' + params.zoomVal + ')';
      } else {
        params.zoomVal = 0.2;
        this.$refs.imgDom.style.transform = 'scale(' + params.zoomVal + ')';
      }
      this.getMaxPosition();
      const target = this.$refs.imgDom;
      let left = parseInt(this.getCss(target, 'left'), 10);
      let top = parseInt(this.getCss(target, 'top'), 10);
      if (left > params.borderLeft) {
        left = params.borderLeft
      } else if (left < params.borderRight) {
        left = params.borderRight
      }

      if (top > params.borderTop) {
        top = params.borderTop
      } else if (top < params.borderBottom) {
        top = params.borderBottom
      }

      target.style.left = left + 'px';
      target.style.top = top + 'px';

      if (this.getCss(target, 'left') !== 'auto') {
        this.params.left = this.getCss(target, 'left');
      }
      if (this.getCss(target, 'top') !== 'auto') {
        this.params.top = this.getCss(target, 'top');
      }
      this.linePosition()
      // this.changeHightPos()
      return false;
    },
    // 实现图片拖拽功能
    startDrag() {
      const bar = this.$refs.contentDom
      const target = this.$refs.imgDom
      const { params } = this;
      if (this.getCss(target, 'left') !== 'auto') {
        this.params.left = this.getCss(target, 'left');
      }
      if (this.getCss(target, 'top') !== 'auto') {
        this.params.top = this.getCss(target, 'top');
      }
      // o是移动对象
      bar.onmousedown = event => {
        this.getMaxPosition()
        this.params.flag = true;
        if (!event) {
          event = window.event;
          // 防止IE文字选中
          bar.onselectstart = () => {
            return false;
          };
        }
        const e = event;
        this.params.currentX = e.clientX;
        this.params.currentY = e.clientY;
      };

      document.onmouseup = () => {
        if (this.params.flag) {
          this.params.flag = false;
          if (this.getCss(target, 'left') !== 'auto') {
            this.params.left = this.getCss(target, 'left');
          }
          if (this.getCss(target, 'top') !== 'auto') {
            this.params.top = this.getCss(target, 'top');
          }
          this.linePosition()
        }
        // 限制图片拖拽不能超出  范围内
        // var e = event ? event : window.event;
        // if (params.flag && params.moved) {
        //   var nowX = e.clientX,
        //     nowY = e.clientY;
        //   var disX = nowX - params.currentX,
        //     disY = nowY - params.currentY;

        //   let left = parseInt(params.left, 10) + disX;
        //   let top = parseInt(params.top, 10) + disY;

        //   left = left > params.borderLeft ? params.borderLeft : left < (params.borderRight) ? params.borderRight : left;
        //   top = top > params.borderTop ? params.borderTop : top < params.borderBottom ? params.borderBottom : top;
        //   target.style.left = left + "px";
        //   target.style.top = top + "px";
        //   this.params.moved = false;
        // }
        // this.params.flag = false;
        // if (this.getCss(target, "left") !== "auto") {
        //   this.params.left = this.getCss(target, "left");
        // }
        // if (this.getCss(target, "top") !== "auto") {
        //   this.params.top = this.getCss(target, "top");
        // }
        // this.changeHightPos()
      };

      document.onmousemove = event => {
        const e = event || window.event;
        if (params.flag) {
          const nowX = e.clientX;
          const nowY = e.clientY;
          const disX = nowX - params.currentX;
          const disY = nowY - params.currentY;
          const left = parseInt(params.left, 10) + disX;
          const top = parseInt(params.top, 10) + disY;

          target.style.left = left + 'px';
          target.style.top = top + 'px';
          // this.changeHightPos()
          this.params.moved = true;

          if (event.preventDefault) {
            event.preventDefault();
          }
          this.linePosition()
          return false;
        }
      };
    },
    // 点击按钮缩放事件
    changeSize(type) {
      const size = 0.02
      if (type) {
        this.zoomVal += size
        this.$refs.imgDom.style.transform = 'scale(' + this.zoomVal + ')';
      } else {
        this.zoomVal -= size
        this.$refs.imgDom.style.transform = 'scale(' + this.zoomVal + ')';
      }
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
  overflow: hidden;
  position: relative;
  -webkit-user-select: none;
  user-select: none;
  cursor: move;

  img {
    position: absolute;
    left: 0;
    height: auto;
    max-width: 100%;
    // max-height: 100%;
  }
}

.light {
  position: absolute;
  box-shadow: 0 0 0px 1000vh rgba(51, 51, 51, 0.4);
  z-index: 1;

  &::before {
    content: ' ';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
