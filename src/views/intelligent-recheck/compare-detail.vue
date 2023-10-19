<template>
  <div class="compare-body">
    <div class="return-1">
      <i class="el-icon-back"></i>
    </div>
    <div class="return-2">
      <i class="el-icon-close"></i>
    </div>
    <div class="compare-detail">
      <div class="compare-left">
        <ImagePreview
          url="http://192.168.210.51:9090/cpr/cpr_1697708778477_微信图片_20230906141828.jpg"
          :showEdit="false"
        ></ImagePreview>
      </div>
      <div class="compare-right">
        <div class="compare-img">
          <div class="detail-header">
            <div class="header-left">
              <svg class="icon urgent-icon" aria-hidden="true">
                <use xlink:href="#icon-shenpiyemiantubiao"></use>
              </svg>
              <svg class="icon urgent-icon" aria-hidden="true">
                <use xlink:href="#icon-tongyongtubiao2"></use>
              </svg>
              <div class="detail-title">睿远平衡18月产品宣传图审核</div>
              <div class="line"></div>
              <div class="detail-title">产品类产品类产品类</div>
              <div class="line"></div>
              <div class="detail-title">任务单号：202308090023</div>
            </div>
          </div>
          <div class="detail-img">
            <div class="similar">相似度:98.7%</div>
            <div class="btn-prev">
              <img src="@/assets/image/home-index/prev.png" alt="" />
            </div>
            <div class="btn-next">
              <img src="@/assets/image/home-index/next.png" alt="" />
            </div>
            <ImagePreview
              url="http://192.168.210.51:9090/cpr/cpr_1697708778477_微信图片_20230906141828.jpg"
              :showEdit="false"
            ></ImagePreview>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImagePreview from './components/imgae-preview'
export default {
  components: {
    ImagePreview
  }
}
</script>

<style lang="less" scoped>
.compare-body {
  position: relative;
  .return-1,
  .return-2 {
    position: absolute;
    top: 32px;
    cursor: pointer;
    i {
      font-size: 24px;
    }
  }
  .return-1 {
    left: 32px;
  }
  .return-2 {
    right: 32px;
  }
  .compare-detail {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: #fff;
    display: flex;
    .compare-left {
      width: 44%;
      border-right: 1px solid #e5e6eb;
      padding: 16px 51px;
    }
    .compare-right {
      width: 56%;
      padding: 16px;
      display: flex;
      .compare-img {
        flex: 1;
        display: flex;
        flex-direction: column;
        .detail-header {
          height: 34px;
          display: flex;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e6eb;
          margin-bottom: 8px;
          .header-left {
            display: flex;
            align-items: center;
            .urgent-icon {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
            .detail-title {
              color: #1d2128;
              font-size: 14px;
              font-style: normal;
              font-weight: 700;
              line-height: 22px;
              margin-right: 4px;
            }
            .line {
              margin: 0 8px;
              width: 1px;
              height: 13.5px;
              background-color: #e5e6eb;
            }
          }
          .header-right {
            color: #2d5cf6;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            cursor: pointer;
          }
        }
        .detail-img {
          position: relative;
          flex: 1;
          padding: 0 119px;
          .similar {
            position: absolute;
            top: 0;
            left: 0;
            padding: 4px 8px;
            border-radius: 6px 0px 16px 0px;
            background: #2d5cf6;
            color: #fff;
            font-size: 10px;
            font-style: normal;
            font-weight: 700;
            line-height: 18px;
          }
          .btn-prev,
          .btn-next {
            position: absolute;
            top: 50%;
            transform: translate(-50%);
            width: 32px;
            height: 32px;
            cursor: pointer;
            img {
              width: 32px;
              height: 32px;
            }
          }
          .btn-prev {
            left: 24px;
          }
          .btn-next {
            right: 24px;
          }
        }
      }
    }
  }
}
</style>
