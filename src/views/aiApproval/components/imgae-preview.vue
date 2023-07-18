<template>
  <div class="watchMap">
    <div class="imgBox" ref="maskBox" @mousedown="onmousedownHandle">
      <img :src="imageUrl" alt="" :style="{
        width: imgW + 'px',
        height: imgH + 'px',
        top: top + 'px',
        left: left + 'px',
        transform: scale,
      }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'imgae-preview',
  data() {
    return {
      imageUrl: "https://img2.baidu.com/it/u=1395980100,2999837177&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=675",
      imgW: 0,
      imgH: 0,
      deg: 0,
      top: 0,
      left: 0,
      scale: "scale(1)",
      size: 0,
      mousewheelevt: null,
    };
  },

  mounted() {
    //初始化图片
    this.initImage();

    // 兼容火狐浏览器
    this.mousewheelevt = /Firefox/i.test(navigator.userAgent)
      ? "DOMMouseScroll"
      : "mousewheel";
    // 为空间区域绑定鼠标滚轮事件 =》 处理函数是wheelHandle
    // 如果你监听了window的scroll或者touchmove事件，你应该把passive设置为true，这样滚动就会流畅很多
    this.$refs.maskBox.addEventListener(this.mousewheelevt, this.wheelHandle);
  },
  beforeDestroy() {
    //取消监听
    this.$refs.maskBox.removeEventListener(
      this.mousewheelevt,
      this.wheelHandle
    );
  },
  created() {
    this.handleReset();
  },
  methods: {
    /**
     *
     * 下載圖片
     * **/

    downloadByBlob(url, name) {
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob) => {
          let url = URL.createObjectURL(blob);
          this.download(url, name);
          // 用完释放URL对象
          URL.revokeObjectURL(url);
        });
      };
    },
    download(href, name) {
      let eleLink = document.createElement("a");
      eleLink.download = name;
      eleLink.href = href;
      eleLink.click();
      eleLink.remove();
    },

    /**
     * 重置
     */
    handleReset() {
      this.imgW = 0;
      this.imgH = 0;
      this.top = 0;
      this.left = 0;
      this.deg = 0;
      this.scale = "scale(1)";
      this.size = 0;
      this.initImage();
    },
    /**
     * 获取图片的url
     * @param {string} url
     */
    getImgSize(url) {
      return new Promise((resolve, reject) => {
        let imgObj = new Image();
        imgObj.src = url;
        imgObj.onload = () => {
          resolve({
            width: imgObj.width,
            height: imgObj.height,
          });
        };
      });
    },
    /**
     * 初始化图片
     */
    async initImage() {
      if (!this.imageUrl) {
        return;
      }
      let { width, height } = await this.getImgSize(this.imageUrl);
      // 设置原始图片的大小
      let realWidth = width;
      let realHeight = height;

      // 获取高宽比例
      const whRatio = realWidth / realHeight;
      const hwRatio = realHeight / realWidth;

      //获取盒子的大小
      const boxW = this.$refs.maskBox.clientWidth;
      const boxH = this.$refs.maskBox.clientHeight;

      if (realWidth >= realHeight) {
        this.imgH = hwRatio * boxW;
        const nih = this.imgH;
        if (nih > boxH) {
          this.imgH = boxH;
          this.imgW = whRatio * boxH;
        } else {
          this.imgW = boxW;
        }
        this.top = (boxH - this.imgH) / 2;
        this.left = (boxW - this.imgW) / 2;
      } else {
        this.imgW = (boxH / realHeight) * realWidth;
        this.imgH = boxH;
        this.left = (boxW - this.imgW) / 2;
      }
    },
    imgScaleHandle(zoom) {
      this.size += zoom;
      if (this.size < -0.5) {
        this.size = -0.5;
      }
      this.scale = `scale(${1 + this.size}) rotateZ(${this.deg}deg)`;
    },
    /**
     * 鼠标滚动 实现放大缩小
     */
    wheelHandle(e) {
      e.preventDefault();
      const ev = e || window.event; // 兼容性处理 => 火狐浏览器判断滚轮的方向是属性 detail，谷歌和ie浏览器判断滚轮滚动的方向是属性 wheelDelta
      // dir = -dir; // dir > 0 => 表示的滚轮是向上滚动，否则是向下滚动 => 范围 (-120 ~ 120)
      const dir = ev.detail ? ev.detail * -120 : ev.wheelDelta;
      //滚动的数值 / 2000 => 表示滚动的比例，用此比例作为图片缩放的比例
      this.imgScaleHandle(dir / 2000);
    },
    /**
     * 处理图片拖动
     */
    onmousedownHandle(e) {
      const that = this;
      this.$refs.maskBox.onmousemove = function (el) {
        const ev = el || window.event; // 阻止默认事件
        ev.preventDefault();
        that.left += ev.movementX;
        that.top += ev.movementY;
      };
      this.$refs.maskBox.onmouseup = function () {
        // 鼠标抬起时将操作区域的鼠标按下和抬起事件置为null 并初始化
        that.$refs.maskBox.onmousemove = null;
        that.$refs.maskBox.onmouseup = null;
      };
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.watchMap {
  width: 100%;
  height: 100%;
  position: relative;

  .imgBox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    img {
      cursor: move;
      position: absolute;
    }
  }

  .Tools {
    width: 43px;
    min-height: 100px;
    position: absolute;
    right: -50px;
    top: 0;
    user-select: none;

    .Tools-item {
      width: 100%;
      height: 44px;
      background: pink;
      margin-bottom: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

    }

    .Tools-item:hover {
      background-color: red;
      color: #fff;
    }
  }
}
</style>