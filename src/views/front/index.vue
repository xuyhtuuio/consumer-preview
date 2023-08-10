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
            <img src="@/assets/image/home-index/banner.png" alt="" />
          </div>
          <div class="btn-prev" :class="{ 'not-allow': canRight }">
            <img
              src="@/assets/image/home-index/prev.png"
              alt=""
              @click="moveLeft"
            />
          </div>
          <div class="btn-next" :class="{ 'not-allow': canLeft }">
            <img
              src="@/assets/image/home-index/next.png"
              alt=""
              @click="moveRight"
            />
          </div>
        </div>
        <div class="link-body">
          <div class="item-body" id="itemBody">
            <div class="link-item" @click="linkJump(0)">
              <div class="item-header">
                <img src="@/assets/image/home-index/new-list.png" alt="" />
                <div class="project-name">消保审查</div>
              </div>
              <div class="project-info">
                辅助发现违规内容并推荐修改意见，构建消保专家知识库与产品知识图谱
              </div>
            </div>
            <div class="link-item" @click="linkJump(1)">
              <div class="item-header">
                <img src="@/assets/image/home-index/xbyj.png" alt="" />
                <div class="project-name">消保预警</div>
              </div>
              <div class="project-info">
                智能识别投诉特征与高危预警，建立投诉画像，挖掘热点问题与风险产品
              </div>
            </div>
            <div class="link-item" @click="linkJump(4)">
              <div class="item-header">
                <img src="@/assets/image/home-index/bqpt.png" alt="" />
                <div class="project-name">AIGC-智能客服</div>
              </div>
              <div class="project-info">
                AIGC赋能客诉处理：实时处理语音内容，智能推荐话术/核查/定责方案
              </div>
            </div>
            <div class="link-item" @click="linkJump(2)">
              <div class="item-header">
                <img src="@/assets/image/home-index/BI.png" alt="" />
                <div class="project-name">BI数据分析平台</div>
              </div>
              <div class="project-info">
                智能BI数据可视化分析，报表分析、可视化地图、领导驾驶舱...
              </div>
            </div>
            <div class="link-item" @click="linkJump(3)">
              <div class="item-header">
                <img src="@/assets/image/home-index/bqpt.png" alt="" />
                <div class="project-name">智能标签平台</div>
              </div>
              <div class="project-info">
                多维度业务场景的知识挖掘引擎，从数据资源到数据资产
              </div>
            </div>
            <div class="link-item" @click="linkJump(5)">
              <div class="item-header">
                <img src="@/assets/image/home-index/bqpt.png" alt="" />
                <div class="project-name">消保指标监控</div>
              </div>
              <div class="project-info">
                实时监控模型指标数据，提供文本探查功能
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="index-list">
        <div class="list-left">
          <div class="left-top">AI 知识语料库</div>
          <div class="list-div">
            <OpinionManage :pageConfig="pageConfig"></OpinionManage>
          </div>
        </div>
        <div class="list-right">
          <div class="progress" v-loading="applyLoading">
            <div class="progress-header">
              <div class="header-icon"></div>
              <div class="header-tip">
                审批进展（{{
                  applyData?.totalCount ? applyData.totalCount : 0
                }}）
              </div>
              <div class="header-link" @click="showMore">查看更多></div>
            </div>
            <div class="progress-list" v-if="applyList.length > 0">
              <div
                class="list-item"
                v-for="(item, index) in applyList"
                :key="'apply' + index"
              >
                <div class="item-title">
                  <svg
                    class="icon urgent-icon"
                    style="width: 14px; height: 16px"
                    aria-hidden="true"
                    v-if="item.urgent === 1"
                  >
                    <use xlink:href="#icon-shenpiyemiantubiao"></use>
                  </svg>
                  <div class="item-title-show">
                    {{ item.taskName }}
                  </div>
                </div>
                <div class="item-time">
                  <!-- <div class="stop-time">
                    <div class="circle"></div>
                    <div class="text-style">滞留1小时</div>
                  </div> -->
                  <div class="please-time">
                    申请时间：{{ item.create_time ? item.create_time : "--" }}
                  </div>
                </div>
                <div class="item-tag">
                  <div class="tag-item blue" v-if="item.submitted === 0">
                    草稿
                  </div>
                  <div
                    class="tag-item blue"
                    v-if="
                      item.submitted === 1 && userInfo.id === item.sponsorMap.id
                    "
                  >
                    <span class="iconfont icon-tijiao airplane-class"></span>
                    我发起的
                  </div>
                  <div
                    class="tag-item"
                    :class="estimateClass(item.currentActivityName)"
                  >
                    {{ item.currentActivityName }}
                  </div>
                  <div
                    class="tag-item-opt"
                    :class="{ 'tag-item-opt-red': item.hasOpinions === 1 }"
                    v-if="item.hasOpinions === 1 || item.hasOpinions === 0"
                  >
                    <i
                      class="iconfont icon icon-guanzhu2"
                      v-if="item.hasOpinions === 1"
                    ></i>
                    <i
                      class="iconfont icon icon-guanzhu"
                      v-if="item.hasOpinions === 0"
                    ></i>
                    {{ item.hasOpinions === 0 ? "无实质意见" : "有实质意见" }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <Empty></Empty>
            </div>
            <div class="progress-bottom">
              <span style="color: #306ef5">{{ numData.toConfirmed }}</span>
              待确认 ，<span style="color: #306ef5">{{
                numData.Approval
              }}</span>
              审批中，<span style="color: #306ef5">{{
                numData.toModified
              }}</span>
              待修改
            </div>
          </div>
          <div class="info-show">
            <div class="info-style" style="font-weight: 700">联系我们</div>
            <div class="info-style">企业官网：www.trs.com.cn</div>
            <div class="info-style">联系我们：dataelite@trs.com.cn</div>
            <div class="info-style">客服电话：6484 8899 分机号：6685</div>
            <div class="info-style">工作时间：周一至周五 9:00-19:00</div>
            <div class="info-style">
              ©️2022拓尔思信息技术股份有限公司 版权所有 京ICP备11022871号-7
            </div>
            <div class="info-style">
              总部地址：北京市海淀区建枫路南延6号院3号楼公司
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OpinionManage from "../admin/manage/opinionManage";
import { getList, getNum } from "../../api/home";
export default {
  components: {
    OpinionManage,
  },
  data() {
    return {
      pageConfig: {
        pageType: "nonManage",
        isAll: 0,
        pageSize: 5,
      },
      canLeft: false,
      canRight: true,
      linkAdress: {
        0: "",
        1: "http://192.168.210.58:31808/index.html",
        2: "http://103.37.44.13:18855/",
        3: "http://192.168.210.57:30648/labelExtractionForDCU.html",
        4: "http://192.168.210.57:31588/aigc-static/intelligent-assistant",
        5: "http://192.168.210.57:31846/supervisory-control/index",
      },
      applyList: [],
      applyLoading: false,
      applyData: {},
      userInfo: {},
      numData: {},
    };
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("user_name"));
    this.getListApi();
    this.getNumApi();
  },
  methods: {
    handleItem(item) {
      console.log(item);
    },
    showMore() {
      this.$router.push("/applycenter/apply-list");
    },
    moveLeft() {
      if (this.canLeft) {
        let element = document.getElementById("itemBody");
        element.style.transform = "translateX(0px)";
        element.style.transition = "all 0.5s";
        this.canLeft = false;
        this.canRight = true;
      }
    },
    moveRight() {
      if (this.canRight) {
        let element = document.getElementById("itemBody");
        element.style.transform = "translateX(-243px)";
        element.style.transition = "all 0.5s";
        this.canLeft = true;
        this.canRight = false;
      }
    },
    linkJump(type) {
      if (type === 0) {
        this.$router.push("/applycenter/apply-list");
      } else {
        window.open(this.linkAdress[type], "_blank");
      }
    },
    getListApi() {
      this.applyLoading = true;
      let that = this;
      let data = {
        adoptionStatus: 0,
        approvalStage: "",
        approvalType: "",
        create_time: "",
        currentActivityName: "",
        hasOpinions: 0,
        id: that.userInfo.id,
        keywords: "",
        label: "",
        launchDate: "",
        name: "",
        pageNo: 1,
        pageSize: 5,
        roleRange: "",
        selected: true,
        sex: "",
        type: "",
        urgent: 0,
        sortType: 1,
        form_management_id: 1,
      };
      getList(data)
        .then((res) => {
          if (res.data.data.list.length > 0) {
            this.applyList = res.data.data.list;
            this.applyData = res.data.data;
          }
          this.applyLoading = false;
        })
        .catch((res) => {
          this.applyLoading = false;
        });
    },
    getNumApi() {
      this.applyLoading = true;
      let that = this;
      let data = {
        adoptionStatus: 0,
        approvalStage: "",
        approvalType: "",
        create_time: "",
        currentActivityName: "",
        hasOpinions: 0,
        id: that.userInfo.id,
        keywords: "",
        label: "",
        launchDate: "",
        name: "",
        pageNo: 1,
        pageSize: 1,
        roleRange: "",
        selected: true,
        sex: "",
        type: "",
        urgent: 0,
        sortType: 1,
        form_management_id: 1,
      };
      getNum(data)
        .then((res) => {
          this.numData = res.data.data[0];
        })
        .catch((res) => {});
    },
    estimateClass(type) {
      if (type) {
        if (type.indexOf("待确认") !== -1) {
          return "deep-green";
        } else if (type.indexOf("待修改") !== -1) {
          return "red";
        } else if (type === "已结束") {
          return "green";
        } else {
          return "orange";
        }
      }
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
        position: relative;
        height: 250px;
        background-color: #e5ecfb;
        .carousel-content {
          display: flex;
          align-items: flex-start;
          img {
            width: 1280px;
            height: 250px;
          }
          .contetn-left {
            color: #505968;
            font-family: Microsoft YaHei;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
          }
        }
        .btn-prev,
        .btn-next {
          position: absolute;
          bottom: -12px;
          width: 24px;
          height: 24px;
          cursor: pointer;
          img {
            width: 24px;
            height: 24px;
          }
        }
        .not-allow {
          cursor: not-allowed;
        }
        .btn-next {
          right: 0;
        }
      }
      .link-body {
        position: absolute;
        width: 1200px;
        height: 112px;
        bottom: 4px;
        margin: 0 40px;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        .item-body {
          display: flex;
          justify-content: space-between;
        }
        .link-item {
          width: 227px;
          height: 112px;
          flex-shrink: 0;
          padding: 16px;
          border-radius: 6px;
          border: 2px solid #fff;
          background: linear-gradient(180deg, #eff2f8 0%, #fff 100%);
          box-shadow: 0px 4px 25px 0px rgba(162, 188, 227, 0.15);
          margin-right: 16px;
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
        .link-item:hover {
          background: #f0f6ff;
          box-shadow: 0px 4px 25px 0px rgba(162, 188, 227, 0.15);
          .item-header {
            .project-name {
              color: #2d5cf6;
            }
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
        .list-div {
          padding: 16px 24px 24px;
        }
      }
      .list-right {
        width: 396px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
              cursor: pointer;
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
                .urgent-icon {
                  margin-right: 8px;
                }
                .item-title-show {
                  // margin-left: 8px;
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
                  display: flex;
                  align-items: center;
                  padding: 2px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 20px;
                  margin-right: 8px;
                  .airplane-class {
                    font-size: 16px;
                    line-height: 20px;
                    margin-right: 2px;
                  }
                }
                .tag-item-opt {
                  padding: 2px 4px;
                  border-radius: 0px 6px 6px 6px;
                  background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 100%);
                  color: #fff;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 20px;
                  display: flex;
                  align-items: center;
                }
                .tag-item-opt-red {
                  background: linear-gradient(90deg, #e85167 0%, #ff8193 100%);
                }
                .orange {
                  background: #fff7e6;
                  color: #fa8c16;
                }
                .deep-green {
                  background: #e6fffb;
                  color: #0da5aa;
                }
                .green {
                  background: #ecfeec;
                  color: #50b142;
                }
                .red {
                  background: #fff1f0;
                  color: #eb5757;
                }
                .blue {
                  background: #f0f6ff;
                  color: #2d5cf6;
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
        .info-show {
          padding-bottom: 16px;
          .info-style {
            color: var(--gray-gray-7, #86909c);
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px;
          }
        }
      }
    }
  }
}
</style>