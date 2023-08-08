<template>
  <div class="front">
    <!-- <transition name="router-fade" mode="out-in">
			  <router-view v-if="!$route.meta.keepAlive" class="view-box "/>
		  </transition> -->
    <div class="front-header"></div>
    <div class="front-body">
      <div class="index-show">
        <div class="carousel">
          <div class="carousel-content">
            <div class="content-left">欢迎来到</div>
            <div class="content-right"></div>
          </div>
        </div>
        <div class="link-body">
          <div class="link-item">
            <div class="item-header">
              <img src="@/assets/image/home-index/new-list.png" alt="" />
              <div class="project-name">消保审查</div>
            </div>
            <div class="project-info">
              辅助发现违规内容并推荐修改意见，构建消保专家知识库与产品知识图谱
            </div>
          </div>
          <div class="link-item">
            <div class="item-header">
              <img src="@/assets/image/home-index/xbyj.png" alt="" />
              <div class="project-name">消保预警</div>
            </div>
            <div class="project-info">
              整合投诉数据、内部产品与审查数据和外部舆情、政策等数据，智能提取投诉业务、原因、诉求等特征
            </div>
          </div>
          <div class="link-item">
            <div class="item-header">
              <img src="@/assets/image/home-index/BI.png" alt="" />
              <div class="project-name">BI平台</div>
            </div>
            <div class="project-info">BI平台</div>
          </div>
          <div class="link-item">
            <div class="item-header">
              <img src="@/assets/image/home-index/bqpt.png" alt="" />
              <div class="project-name">标签平台</div>
            </div>
            <div class="project-info">多维度业务场景的知识挖掘引擎</div>
          </div>
          <div class="link-item">
            <div class="item-header">
              <img src="@/assets/image/home-index/bqpt.png" alt="" />
              <div class="project-name">AIGC</div>
            </div>
            <div class="project-info">
              AIGC赋能客诉处理：实时处理语音内容，智能推荐话术，定责
            </div>
          </div>
        </div>
      </div>
      <div class="index-list">
        <div class="list-left">
          <div class="left-top">AI 知识语料库</div>
          <OpinionManage :pageConfig="pageConfig"></OpinionManage>
        </div>
        <div class="list-right">
          <div class="progress">
            <div class="progress-header">
              <div class="header-icon"></div>
              <div class="header-tip">审批进展（24）</div>
              <div class="header-link">查看更多></div>
            </div>
            <div class="progress-list">
              <div class="list-item">
                <div class="item-title">
                  <svg
                    class="icon urgent-icon"
                    style="width: 14px; height: 16px"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-shenpiyemiantubiao"></use>
                  </svg>
                  <div class="item-title-show">
                    睿远平衡18月产品宣传图审核睿远平衡18月产品宣传图审核
                  </div>
                </div>
                <div class="item-time">
                  <div class="stop-time">
                    <div class="circle"></div>
                    <div class="text-style">滞留1小时</div>
                  </div>
                  <div class="please-time">申请时间：2021-08-23 08:00:00</div>
                </div>
                <div class="item-tag">
                  <div class="tag-item orange">审批中>消保中心审批</div>
                </div>
              </div>
              <div class="list-item">
                <div class="item-title">
                  <svg
                    class="icon urgent-icon"
                    style="width: 14px; height: 16px"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-shenpiyemiantubiao"></use>
                  </svg>
                  <div class="item-title-show">
                    睿远平衡18月产品宣传图审核睿远平衡18月产品宣传图审核
                  </div>
                </div>
                <div class="item-time">
                  <div class="stop-time">
                    <div class="circle"></div>
                    <div class="text-style">滞留1小时</div>
                  </div>
                  <div class="please-time">申请时间：2021-08-23 08:00:00</div>
                </div>
                <div class="item-tag">
                  <div class="tag-item orange">审批中>消保中心审批</div>
                </div>
              </div>
            </div>
            <div class="progress-bottom">
              <span style="color: #306ef5">3</span> 待确认 ，<span
                style="color: #306ef5"
                >1</span
              >
              审批中，<span style="color: #306ef5">2</span> 待修改
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OpinionManage from '../admin/manage/opinionManage';
export default {
  components: {
    OpinionManage
  },
  data() {
    return {
      pageConfig: {
        pageType: 'nonManage'
      }
    };
  },
  methods: {
    handleItem(item) {
      console.log(item);
    },
  },
};
</script>

<style lang="less" scoped>
.front {
  position: relative;
  background: #f9fbff;
  display: flex;
  justify-content: center;
  padding-top: 0 !important;
  .front-header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 250px;
    background-color: #e5ecfb;
  }
  .front-body {
    width: 1280px;
    .index-show {
      position: relative;
      box-sizing: border-box;
      height: 310px;
      margin-bottom: 16px;
      .carousel {
        height: 250px;
        background-color: #e5ecfb;
        .carousel-content {
          display: flex;
          align-items: flex-start;
          .contetn-left {
            color: #505968;
            font-family: Microsoft YaHei;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
          }
        }
      }
      .link-body {
        position: absolute;
        width: 100%;
        height: 112px;
        bottom: 4px;
        padding: 0 40px;
        display: flex;
        justify-content: space-between;
        .link-item {
          width: 227px;
          height: 112px;
          padding: 16px;
          border-radius: 6px;
          border: 2px solid #fff;
          background: linear-gradient(180deg, #eff2f8 0%, #fff 100%);
          box-shadow: 0px 4px 25px 0px rgba(162, 188, 227, 0.15);
          cursor: pointer;
          .item-header {
            display: flex;
            align-content: center;
            margin-bottom: 10px;
            img {
              width: 32px;
              height: 32px;
              margin-right: 12px;
            }
            .project-name {
              color: #1d2128;
              font-size: 16px;
              font-style: normal;
              font-weight: 400;
              line-height: 32px;
            }
          }
          .project-info {
            color: #86909c;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
      }
    }
    .index-list {
      flex: 1;
      display: flex;
      .list-left {
        flex: 1;
        margin-right: 16px;
        border-radius: 10px;
        background: #fff;
        .left-top {
          padding: 24px 24px 12px;
          border-bottom: 1px solid #e5e6eb;
          color: #1d2128;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px;
        }
      }
      .list-right {
        width: 396px;
        .progress {
          border-radius: 10px;
          background-color: #fff;
          .progress-header {
            width: 100%;
            height: 60px;
            padding: 24px 24px 12px 0;
            border-bottom: 1px solid #e5e6eb;
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            .header-icon {
              width: 5px;
              height: 20px;
              background: #2d5cf6;
              margin-right: 19px;
            }
            .header-tip {
              color: #1d2128;
              font-size: 16px;
              font-style: normal;
              font-weight: 400;
              line-height: 24px;
              flex: 1;
              margin-right: 16px;
            }
            .header-link {
              color: #2d5cf6;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 22px;
            }
          }
          .progress-list {
            .list-item {
              padding: 16px;
              margin-bottom: 12px;
              .item-title {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                .item-title-show {
                  margin-left: 8px;
                  color: #1d2128;
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 700;
                  line-height: 22px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  overflow: hidden;
                }
              }
              .item-time {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                .stop-time {
                  display: flex;
                  align-items: center;
                  margin-right: 24px;
                  .circle {
                    width: 10px;
                    height: 10px;
                    border-radius: 10px;
                    background: #fdb123;
                    margin-right: 8px;
                  }
                  .text-style {
                    color: #86909c;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                  }
                }
                .please-time {
                  color: #86909c;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 20px;
                }
              }
              .item-tag {
                display: flex;
                align-items: center;
                .tag-item {
                  padding: 2px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 20px;
                }
                .orange {
                  background: #fff7e6;
                  color: #fa8c16;
                }
              }
            }
            .list-item:hover {
              background-color: #f7f8fa;
            }
          }
          .progress-bottom {
            padding: 12px 24px;
            background-color: #f2f3f5;
            text-align: center;
            color: #86909c;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            border-radius: 0 0 10px 10px;
          }
        }
      }
    }
  }
}
</style>