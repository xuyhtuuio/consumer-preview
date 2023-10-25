<template>
  <div class="recheck">
    <div class="recheck-header">
      <img src="@/assets/image/intelligent-recheck/bgc.png" alt="" />
      <div class="recheck-input" :class="{ 'recheck-input-focus': focus }">
        <el-input
          :placeholder="placeholder"
          v-model="recheckInput"
          @focus="focusInput"
          @blur="blurInput"
          class="input-with-select"
        >
          <el-select v-model="select" slot="prepend" @change="changeSearch" placeholder="请选择" popper-class="content-select">
            <el-option label="按文件名称" value="1"></el-option>
            <el-option label="按文本内容" value="2"></el-option>
          </el-select>
          <div slot="append">
            <div class="append-set">
              <div class="upload">
                <i class="el-icon-camera" @click="showUpload"></i>
              </div>
              <div class="recheck-btn">智能回检</div>
            </div>
          </div>
        </el-input>
      </div>
    </div>
    <div class="recheck-body">
      <img src="@/assets/image/intelligent-recheck/compare.png" alt="" />
    </div>
    <div class="recheck-bottom">
      <div class="bottom-tip">查看回检记录</div>
      <div class="bottom-list">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide list-item">
              <div>· 2023/09/01</div>
              <div class="middle-1">景顺长城集英成长月报景顺长城集英成长月报</div>
          <div class="middle-2">未通过回检</div>
          <img src="@/assets/image/ai-approval/ocr-avatar.png" alt="" />
              <div class="middle-2">李阿慧/300592</div>
              <div class="middle-2">北京银行天津分行</div>
              <div class="middle-2">1小时前更新一条回检记录</div>
            </div>
            <div class="swiper-slide list-item">
          <div>· 2023/09/01</div>
          <div class="middle-1">景顺长城集英成长月报景顺长城集英成长月报</div>
          <div class="middle-2">已通过回检</div>
          <img src="@/assets/image/ai-approval/ocr-avatar.png" alt="" />
          <div class="middle-2">李阿慧/300592</div>
          <div class="middle-2">北京银行天津分行</div>
          <div class="middle-2">18小时前更新一条回检记录</div>
            </div>
            <div class="swiper-slide list-item">
          <div>· 2023/09/01</div>
          <div class="middle-1">景顺长城集英成长月报景顺长城集英成长月报</div>
          <div class="middle-2">已通过回检</div>
          <img src="@/assets/image/ai-approval/ocr-avatar.png" alt="" />
          <div class="middle-2">李阿慧/300592</div>
          <div class="middle-2">总行</div>
          <div class="middle-2">12天前更新一条回检记录</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UploadDialog ref="uploadDia"></UploadDialog>
  </div>
</template>

<script>
import 'swiper/css/swiper.css'
import Swiper from 'swiper'
import UploadDialog from './components/upload-dialog'
export default {
  components: {
    UploadDialog
  },
  data: () => ({
    recheckInput: '',
    select: '1',
    swiper: null,
    focus: false,
    placeholder: '请输入文件名或上传图片进行回检'
  }),
  mounted() {
    const swiper = new Swiper('.swiper-container', {
      loop: true, // 循环
      direction: 'vertical',
      slidesPerView: 3,
      spaceBetween: 0, // swiper-slide 间的距离为30
      autoplay: {
        delay: 3000, // 自动播放的间隔时间，单位ms，默认3000ms
        disableOnInteraction: false // 点击不会取消自动
      }
    });
    this.swiper = swiper
  },
  methods: {
    changeSearch(val) {
      if (val === '1') {
        this.placeholder = '请输入文件名或上传图片进行回检'
      } else {
        this.placeholder = '请输入关键词或上传图片进行回检'
      }
    },
    showUpload() {
      this.$refs.uploadDia.turnDialog = true
    },
    focusInput() {
      this.focus = true;
    },
    blurInput() {
      this.focus = false;
    }
  }
}
</script>

<style lang="less" scoped>
.recheck {
  &-header {
    margin: -16px -80px 0;
    height: 160px;
    position: relative;
    background: linear-gradient(90deg, #cce3ff 0%, #d4e6ff 100%);
    margin-bottom: 40px;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      height: 160px;
    }
    .recheck-input {
      position: absolute;
      width: 600px;
      height: 40px;
      padding-left: 20px;
      top: 92px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 60px;
      border: 1px solid #CACDD3;
      background: #fff;
      overflow: hidden;
      /deep/ .el-input {
        height: 38px;
        .el-icon-arrow-up::before {
          content: '\e78f';
        }
        .el-input__inner {
          height: 38px;
          border: none;
        }
        .el-input-group__prepend {
          border: none;
          .el-select {
            width: 105px;
            display: flex;
            align-items: center;
            background-color: #fff;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            color: #505968;
            .el-input__inner {
              padding-left: 0;
            }
          }
          .el-select::after {
            content: '';
            display: inline-block;
            width: 1px;
            height: 16px;
            background-color: #cacdd3;
          }
        }
        .el-input-group__append {
          background-color: #306ef5;
          height: 40px;
          border: none;
          .append-set {
            display: flex;
            align-items: center;
            .recheck-btn {
              color: #fff;
              font-size: 14px;
              font-style: normal;
              font-weight: 700;
              line-height: 40px;
              cursor: pointer;
            }
            .upload {
              width: 40px;
              height: 40px;
              margin-right: 20px;
              background: #fff;
              margin-left: -20px;
              display: flex;
              align-items: center;
              justify-content: center;
              .el-icon-camera {
                width: 20px;
                height: 20px;
                font-size: 20px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .recheck-input-focus {
      border: 1px solid #306ef5;
    }
  }
  &-body {
    display: flex;
    justify-content: center;
    img {
      width: 825px;
    }
  }
  &-bottom {
    padding-top: 48px;
    width: 100%;
    .bottom-tip {
      color: #2d5cf6;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      text-decoration-line: underline;
      margin-bottom: 4px;
    }
    .bottom-list {
      .swiper-container {
        height: 66px;
      }
      .list-item {
        display: flex;
        align-items: center;
        color: #1d2128;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        opacity: 0.6;
        .middle-1 {
          margin-left: 8px;
          width: 160px;
          word-break: break-all;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .middle-2 {
          margin-left: 8px;
        }
        img {
          width: 20px;
          height: 20px;
          margin-left: 8px;
        }
      }
      .swiper-slide-next {
        opacity: 1;
      }
    }
  }
}
</style>
<style lang="less">
.content-select {
  padding: 16px 8px;
  margin-top: 8px;
  .el-scrollbar__view {
    padding: 0;
  }
  .el-select-dropdown__item {
    padding: 6px 16px;
    color: #1D2128;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
  .popper__arrow::after {
    border-bottom-color: transparent!important;
  }
}
</style>
