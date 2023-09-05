<template>
  <div style="height: 100%;">
    <div id="imgEditor"  style="height: 100%;" ref="tui-image-editor">
    </div>
    <div class="btn-group">
      <div class="edit-btn"  @click="handleCanvas2Img">保存修改</div>
    </div>
  </div>
</template>

<script>
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import ImageEditor from 'tui-image-editor'

// 中文菜单
const localeCN = {
  Crop: '裁剪',
  Draw: '涂鸦',
  Text: '添加文本'
  // Free: '任意线条',
  // Straight: '直线',
  // Icon: '添加图标',
  // Color: '颜色',
  // Range: '范围'
}
// 画布组件自定义样式
const customTheme = {
  // image 坐上角度图片
  'common.bi.image': '', // 在这里换上你喜欢的logo图片
  'common.bisize.width': '0px',
  'common.bisize.height': '0px',
  'common.backgroundImage': 'none',
  'common.backgroundColor': '#f3f4f6',
  'common.border': '1px solid #444',

  // header
  'header.backgroundImage': 'none',
  'header.backgroundColor': '#f3f4f6',
  'header.border': '0px',

  // load button
  'loadButton.backgroundColor': '#fff',
  'loadButton.border': '1px solid #ddd',
  'loadButton.color': '#222',
  'loadButton.fontFamily': 'NotoSans, sans-serif',
  'loadButton.fontSize': '12px',
  'loadButton.display': 'none', // 可以直接隐藏掉

  // download button
  'downloadButton.backgroundColor': '#fdba3b',
  'downloadButton.border': '1px solid #fdba3b',
  'downloadButton.color': '#fff',
  'downloadButton.fontFamily': 'NotoSans, sans-serif',
  'downloadButton.fontSize': '12px',
  'downloadButton.display': 'none', // 可以直接隐藏掉

  // icons default
  'menu.normalIcon.color': '#8a8a8a',
  'menu.activeIcon.color': '#555555',
  'menu.disabledIcon.color': '#434343',
  'menu.hoverIcon.color': '#e9e9e9',
  'submenu.normalIcon.color': '#8a8a8a',
  'submenu.activeIcon.color': '#e9e9e9',

  'menu.iconSize.width': '24px',
  'menu.iconSize.height': '24px',
  'submenu.iconSize.width': '32px',
  'submenu.iconSize.height': '32px',

  // submenu primary color
  'submenu.backgroundColor': '#1e1e1e',
  'submenu.partition.color': '#858585',

  // submenu labels
  'submenu.normalLabel.color': '#858585',
  'submenu.normalLabel.fontWeight': 'lighter',
  'submenu.activeLabel.color': '#fff',
  'submenu.activeLabel.fontWeight': 'lighter',

  // checkbox style
  'checkbox.border': '1px solid #ccc',
  'checkbox.backgroundColor': '#fff',

  // rango style
  'range.pointer.color': '#fff',
  'range.bar.color': '#666',
  'range.subbar.color': '#d1d1d1',

  'range.disabledPointer.color': '#414141',
  'range.disabledBar.color': '#282828',
  'range.disabledSubbar.color': '#414141',

  'range.value.color': '#fff',
  'range.value.fontWeight': 'lighter',
  'range.value.fontSize': '11px',
  'range.value.border': '1px solid #353535',
  'range.value.backgroundColor': '#151515',
  'range.title.color': '#fff',
  'range.title.fontWeight': 'lighter',

  // colorpicker style
  'colorpicker.button.border': '1px solid #1e1e1e',
  'colorpicker.title.color': '#fff'
}
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 画布对象
      instance: null,
      params: {},
      transform: {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      },
      flag: false,
    }
  },
  mounted() {
  },
  created() {
    this.$nextTick(async () => {
      await this.initImgEditor();
      await this.deviceSupportInstall();
      document.addEventListener('mouseup', this.mouseup);
    });
  },
  computed: {
    imageEditor() {
      return this.$refs['tui-image-editor'].querySelector(
        '.tui-image-editor-align-wrap'
      );
    },
    imgStyle() {
      return this.$refs['tui-image-editor'].querySelector('.tui-image-editor-canvas-container');
    },
  },
  watch: {
    instance: {
      // 监听当前是否选中工具栏，如果选中图片不可进行拖拽
      handler(newVal) {
        if (newVal.ui.submenu) {
          this.flag = true;
          // 是否需要重置图片的放大缩小
          // this.transform.offsetX = 0
          // this.transform.offsetY = 0
          // this.imgStyle.style.marginLeft = `0px`
          // this.imgStyle.style.marginTop = `0px`
        } else {
          this.flag = false;
        }
      },
      deep: true,
    },
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.mouseup);
    this.imageEditor.removeEventListener('mousewheel', this._mouseWheelHandler);
    this.imageEditor.removeEventListener('mousedown', this.mousedown);
    this._mouseWheelHandler = null;
  },
  methods: {
    // 节流
    rafThrottle(fn) {
      let locked = false;
      return function (...args) {
        if (locked) return;
        locked = true;
        window.requestAnimationFrame(() => {
          fn.apply(this, args);
          locked = false;
        });
      };
    },
    mouseup() {
      this.imageEditor.removeEventListener('mousemove', this._dragHandler);
    },
    deviceSupportInstall() {
      this._mouseWheelHandler = this.rafThrottle((e) => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.05,
          });
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.05,
          });
        }
      });

      this.imageEditor.addEventListener('mousewheel', this._mouseWheelHandler);
      this.imageEditor.addEventListener('mousedown', this.mousedown);
    },
    mousedown(e) {
      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = (ev) => {
        if (this.flag) return;
        this.transform.offsetX = offsetX + ev.pageX - startX;
        this.transform.offsetY = offsetY + ev.pageY - startY;
        this.imgStyle.style.marginLeft = `${offsetX + ev.pageX - startX}px`;
        this.imgStyle.style.marginTop = `${offsetY + ev.pageY - startY}px`;
      };
      this.imageEditor.addEventListener('mousemove', this._dragHandler);
    },
    handleActions(action, options = {}) {
      const { zoomRate } = {
        zoomRate: 0.2,
        ...options,
      };
      const { transform } = this;
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            );
          }
          break;
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        default:
          break;
      }
      const { scale } = this.transform;
      this.imgStyle.style.transform = `scale(${scale})`;
    },
    handleCanvas2Img() {
      // 重置缩放，防止缩放导致的图片被画布裁剪
      this.instance.resetZoom()
      // 调用组件官方方法，获取整个编辑后图片的base64
      const base64String = this.instance.toDataURL()
      this.$emit('saveImg', base64String)
    },
    initImgEditor() {
      // 创建tui-image-editor组件实例
      this.instance = new ImageEditor(
        document.querySelector('#imgEditor'),
        {
          includeUI: {
            // 默认加载的图片
            loadImage: {
              // 图片路径
              path: this.url,
              // 图片的名字，可以省略
              name: 'image'
            },
            // 默认开启绘图的功能,小屏幕情况下，直接打开菜单，会占用较大屏幕空间，不美观
            initMenu: 'draw',
            // 支持的菜单
            menu: [
              // 'crop', // 裁切
              'draw', // 添加绘画
              'text' // 添加文本
            ],
            // 菜单位置在下面
            menuBarPosition: 'left',
            // 汉化
            locale: localeCN,
            // 自定义样式（隐藏默认顶部栏目、按钮颜色。。。）
            theme: customTheme
          },
          // 设置画布的最大宽高，能自动等比例缩放大图片到指定的宽高内
          // !设置小图宽高，自动压缩图片，防止过大出现滚动，导致无法操作
          cssMaxWidth: 350,
          cssMaxHeight: 500
        }
      )
      // 清除自定义样式造成的一条边框线
      document.getElementsByClassName('tui-image-editor-main')[0].style.top = 0
      // 设置图片编辑其余距离底部90px（就不会被底部展开的工具栏遮挡住了）===>无效
      // document.getElementsByClassName('tui-image-editor-wrap')[0].style.bottom = 90

      //! 修改图片编辑器的顶部导航栏
      document.querySelector('[tooltip-content="History"]').style.display = 'none'
      document.querySelector('[tooltip-content="ZoomOut"]').style.display = 'none'
      document.querySelector('[tooltip-content="ZoomIn"]').style.display = 'none'
      document.querySelector('[tooltip-content="Hand"]').style.display = 'none'
      // document.querySelector('[tooltip-content="Undo"]').style.display = 'none'// 上一步
      document.querySelector('[tooltip-content="Redo"]').style.display = 'none' // 下一步
      document.querySelector('[tooltip-content="Reset"]').style.display = 'none' // 完全重新编辑
      document.querySelector('[tooltip-content="Delete"]').style.display = 'none'
      document.querySelector('[tooltip-content="DeleteAll"]').style.display = 'none'
      // 隐藏分割线
      document.querySelectorAll('.tui-image-editor-icpartition').forEach(item => {
        item.style.display = 'none'
      })
      // 绑定缩放事件
      const content = this.$refs['tui-image-editor']
      content.removeEventListener('wheel', this.handleWheel)
      content.addEventListener('wheel', this.handleWheel)
    },
  }
}
</script>

<style lang="less" scoped>
.btn-group{
  display: flex;
  margin-top: 5px;
  margin-bottom: 5px;
  flex-wrap: unset;
  justify-content: flex-end;
}
.edit-btn{
  cursor: pointer;
  color: #2d5cf6;
}
</style>
