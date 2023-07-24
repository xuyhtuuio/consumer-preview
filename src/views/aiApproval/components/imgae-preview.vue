<template>
  <div class="preview" ref="contentDom" v-loading="!loaded">
    <img id="picture" src="../img.png" @load="handleImageLoaded" ref="imgDom" />
    <div class="light" id="imgLight" ref="light" v-if="lineWordItem?.word" :style="this.BoundingClientRect">
    </div>
  </div>
</template>

<script>
const paramsInit = {
  zoomVal: 1,
  left: 0,
  top: 0,
  currentX: 0,
  currentY: 0,
  flag: false,
  border_left: 0,
  border_right: 0,
  border_top: 0,
  border_bottom: 0,
  moved: false
}
export default {
  props: {
    lineWordItem: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      loaded: false,
      params: JSON.parse(JSON.stringify(paramsInit)),
      naturalHeight: 0,
      naturalWidth: 0,
      scale: 1,
      BoundingClientRect: {}
    }
  },
  watch: {
    lineWordItem: {
      handler(val) {
        this.setBoundingClientRect(val)
      },
      // deep: true
    }
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
        // const positionZoom = this.params.zoomVal - this.$refs.imgDom.clientWidth / this.$refs.imgDom.naturalWidth
        this.BoundingClientRect = {
          width: val?.location.w * this.scale + 'px',
          height: val?.location.h * this.scale + 'px',
          left: (val?.location.x * this.scale * this.params.zoomVal + parseInt(this.params.left, 10)) + 'px',
          top: (val?.location.y * this.scale * this.params.zoomVal  + parseInt(this.params.top, 10)) + 'px',
          // left: parseInt(this.params.left, 10) * positionZoom + 'px',
          // top: parseInt(this.params.top, 10) * positionZoom + 'px',
          transform: `scale(${this.params.zoomVal})`
        }
      }
    },
    // 图片加载完后,初始化
    handleImageLoaded() {
      setTimeout(() => {
        this.loaded = true;
        this.naturalWidth = this.$refs.imgDom.naturalWidth;
        this.naturalHeight = this.$refs.imgDom.naturalHeight;
        this.scale = this.$refs.imgDom.clientWidth / this.$refs.imgDom.naturalWidth;
        this.getMaxPosition()
        this.initCenter()
        // 绑定缩放事件
        const content = this.$refs.contentDom
        content.addEventListener('wheel', this.handleWheel)
        // 绑定拖拽
        this.startDrag()
      }, 1000);
    },
    // 计算出允许拖拽的最大偏移量
    getMaxPosition() {
      const params = this.params;
      if (this.$refs.imgDom.clientHeight <= 0) {
        return;
      }
      // 左右边距
      let border_left = ((params.zoomVal - 1) * this.$refs.imgDom.clientWidth) / 2;;
      let border_right = this.$refs.contentDom.clientWidth - this.$refs.imgDom.clientWidth - border_left;
      let topArr = [border_left, border_right];
      this.params.border_left = Math.max.apply(null, topArr)
      this.params.border_right = Math.min.apply(null, topArr)
      // 上下边距
      let border_top = ((this.params.zoomVal - 1) * this.$refs.imgDom.clientHeight) / 2;
      let border_bottom = this.$refs.contentDom.clientHeight - this.$refs.imgDom.clientHeight - border_top;
      topArr = [border_top, border_bottom];
      this.params.border_top = Math.max.apply(null, topArr)
      this.params.border_bottom = Math.min.apply(null, topArr)
    },
    // 初始化图片中心
    initCenter() {
      let params = this.params;
      let target = this.$refs.imgDom;
      if (params.border_left == params.border_right) {
        //调整上下位置
        target.style.top = (params.border_top / 2) + "px";
      } else {
        // 调整左右位置
        target.style.left = (params.border_left / 2) + "px";
      }
      if (this.getCss(target, "left") !== "auto") {
        this.params.left = this.getCss(target, "left");
      }
      if (this.getCss(target, "top") !== "auto") {
        this.params.top = this.getCss(target, "top");
      }
      target.style.transform = "scale(1)";
    },
    //获取相关CSS属性
    getCss(o, key) {
      return o.currentStyle
        ? o.currentStyle[key]
        : document.defaultView.getComputedStyle(o, false)[key];
    },
    // 滚轮缩放事件
    handleWheel(event) {
      this.getMaxPosition()
      let params = this.params;
      this.params.zoomVal += -event.deltaY / 1200;
      if (params.zoomVal >= 0.2) {
        this.$refs.imgDom.style.transform = "scale(" + params.zoomVal + ")";
      } else {
        params.zoomVal = 0.2;
        this.$refs.imgDom.style.transform = "scale(" + params.zoomVal + ")";
      }
      this.getMaxPosition();
      let target = this.$refs.imgDom;
      let left = parseInt(this.getCss(target, "left"), 10);
      let top = parseInt(this.getCss(target, "top"), 10);

      left = left > params.border_left ? params.border_left : left < (params.border_right) ? params.border_right : left;
      top = top > params.border_top ? params.border_top : top < params.border_bottom ? params.border_bottom : top;
      target.style.left = left + "px";
      target.style.top = top + "px";

      if (this.getCss(target, "left") !== "auto") {
        this.params.left = this.getCss(target, "left");
      }
      if (this.getCss(target, "top") !== "auto") {
        this.params.top = this.getCss(target, "top");
      }
      this.linePosition()
      // this.changeHightPos()
      return false;
    },
    // 实现图片拖拽功能
    startDrag() {
      const bar = this.$refs.contentDom
      const target = this.$refs.imgDom
      let params = this.params;
      if (this.getCss(target, "left") !== "auto") {
        this.params.left = this.getCss(target, "left");
      }
      if (this.getCss(target, "top") !== "auto") {
        this.params.top = this.getCss(target, "top");
      }
      //o是移动对象
      bar.onmousedown = event => {
        this.getMaxPosition()
        this.params.flag = true;
        if (!event) {
          event = window.event;
          //防止IE文字选中
          bar.onselectstart = () => {
            return false;
          };
        }
        var e = event;
        this.params.currentX = e.clientX;
        this.params.currentY = e.clientY;
      };

      document.onmouseup = (event) => {
        if (this.params.flag) {
          this.params.flag = false;
          if (this.getCss(target, "left") !== "auto") {
            this.params.left = this.getCss(target, "left");
          }
          if (this.getCss(target, "top") !== "auto") {
            this.params.top = this.getCss(target, "top");
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

        //   left = left > params.border_left ? params.border_left : left < (params.border_right) ? params.border_right : left;
        //   top = top > params.border_top ? params.border_top : top < params.border_bottom ? params.border_bottom : top;
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
        var e = event ? event : window.event;
        if (params.flag) {
          var nowX = e.clientX,
            nowY = e.clientY;
          var disX = nowX - params.currentX,
            disY = nowY - params.currentY;
          let left = parseInt(params.left, 10) + disX;
          let top = parseInt(params.top, 10) + disY;

          target.style.left = left + "px";
          target.style.top = top + "px";
          // this.changeHightPos()
          this.params.moved = true;

          if (event.preventDefault) {
            event.preventDefault();
          }
          this.linePosition()
          return false;
        }
      };
    }
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
    max-height: 100%;
  }
}

.light {
  position: absolute;
  box-shadow: 0 0 0px 100vh rgba(51, 51, 51, 0.4);
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