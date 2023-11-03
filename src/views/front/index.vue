<template>
  <div class="front">
    <div class="front-header"></div>
    <div class="front-body">
      <div class="index-show">
        <div class="carousel">
          <div class="carousel-content">
            <img src="@/assets/image/home-index/banner.png" alt="" />
          </div>
        </div>
        <div class="file-header-swiper">
          <div class="link-body swiper-container">
            <div class="item-body swiper-wrapper" id="itemBody">
            <div class="link-item swiper-slide" @click="linkJump(0)">
              <div class="item-header">
                <img src="@/assets/image/home-index/new-list.png" alt="" />
                <div class="project-name">消保审查</div>
              </div>
              <div class="project-info">
                辅助发现违规内容并推荐修改意见，构建消保专家知识库与产品知识图谱
              </div>
            </div>
            <div class="link-item swiper-slide" @click="linkJump(6)">
              <div class="item-header">
                <img src="@/assets/image/home-index/xbyj.png" alt="" />
                <div class="project-name">投诉处理</div>
              </div>
              <div class="project-info">
                智能识别投诉特征与高危预警，建立投诉画像，挖掘热点问题与风险产品
              </div>
            </div>
            <div class="link-item swiper-slide" @click="linkJump(4)">
              <div class="item-header">
                <img src="@/assets/image/home-index/aigc.png" alt="" />
                <div class="project-name">AIGC-智能客服</div>
              </div>
              <div class="project-info">
                AIGC赋能客诉处理：实时处理语音内容，智能推荐话术/核查/定责方案
              </div>
            </div>
            <div class="link-item swiper-slide" @click="linkJump(1)">
              <div class="item-header">
                <img src="@/assets/image/home-index/xbyj.png" alt="" />
                <div class="project-name">消保预警</div>
              </div>
              <div class="project-info">
                智能识别投诉特征与高危预警，建立投诉画像，挖掘热点问题与风险产品
              </div>
            </div>
            <div class="link-item swiper-slide" @click="linkJump(2)">
              <div class="item-header">
                <img src="@/assets/image/home-index/BI.png" alt="" />
                <div class="project-name">BI数据分析平台</div>
              </div>
              <div class="project-info">
                智能BI数据可视化分析，报表分析、可视化地图、领导驾驶舱...
              </div>
            </div>
            <div class="link-item swiper-slide" @click="linkJump(7)">
              <div class="item-header">
                <img src="@/assets/image/home-index/icon.png" alt="" />
                <div class="project-name">语义智能分析平台</div>
              </div>
              <div class="project-info">
                快速实现行业化、个性化的人工智能模型开发和构建
              </div>
            </div>
            <div class="link-item swiper-slide" @click="linkJump(3)">
              <div class="item-header">
                <img src="@/assets/image/home-index/bqpt.png" alt="" />
                <div class="project-name">智能标签平台</div>
              </div>
              <div class="project-info">
                多维度业务场景的知识挖掘引擎，从数据资源到数据资产
              </div>
            </div>
            <div class="link-item swiper-slide" @click="linkJump(5)">
              <div class="item-header">
                <img src="@/assets/image/home-index/icon.png" alt="" />
                <div class="project-name">消保指标监控</div>
              </div>
              <div class="project-info">
                实时监控模型指标数据，提供文本探查功能
              </div>
            </div>
            </div>
          </div>
          <div class="btn-prev swiper-button-prev">
            <img
              class="no-hover"
              src="@/assets/image/home-index/prev.png"
              alt=""
            />
            <img
              class="hover"
              src="@/assets/image/home-index/btn-prev.png"
              alt=""
            />
          </div>
          <div class="btn-next swiper-button-next">
            <img
              class="no-hover"
              src="@/assets/image/home-index/next.png"
              alt=""
            />
            <img
              class="hover"
              src="@/assets/image/home-index/btn-next.png"
              alt=""
            />
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
                      item.submitted === 1 && item.sponsorMap &&
                      userInfo.id + '' === item.sponsorMap.id
                    "
                  >
                    <span class="iconfont icon-tijiao airplane-class"></span>
                    我发起的
                  </div>
                  <span class="event-status" v-if="!item.ocr_approval_status">
                    <i v-if="item.taskStatus === '0'" class="tag draft">{{
                      $msg('NodeStatus')[item.taskStatus]
                    }}</i>
                    <i v-if="['1', '2'].includes(item.taskStatus)" class="tag in-approval"
                      >{{ $msg('NodeStatus')[item.taskStatus] }}>{{
                        item.currentActivityName
                      }}</i
                    >
                    <i v-if="item.taskStatus === '3'" class="tag in-modify"
                      >{{ $msg('NodeStatus')[item.taskStatus] }}>{{
                        item.currentActivityName
                      }}</i
                    >
                    <i v-if="['5', '6'].includes(item.taskStatus)" class="tag check"
                      >{{ $msg('NodeStatus')[item.taskStatus] }}>{{
                        item.currentActivityName
                      }}</i
                    >
                    <i v-if="item.taskStatus === '4'" class="end">
                      <i class="tag end-sign"
                        >{{ $msg('NodeStatus')[item.taskStatus] }}>{{
                          item.currentActivityName
                        }}
                      </i>
                    </i>
                  </span>
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
import Swiper from 'swiper';
import md5 from 'js-md5'
import 'swiper/css/swiper.min.css';
import OpinionManage from '../admin/manage/opinionManage';
import { getList, getNum } from '../../api/home';
export default {
  components: {
    OpinionManage,
  },
  data() {
    return {
      pageConfig: {
        pageType: 'nonManage',
        isAll: 0,
        pageSize: 5,
      },
      canLeft: false,
      canRight: true,
      linkAdress: {
        0: '',
        1: 'http://ccpw.dataelite.trs.com.cn',
        2: 'http://103.37.44.13:18855',
        3: 'https://rm.dataelite.trs.com.cn/labelExtractionForDCU.html',
        4: 'http://ics.dataelite.trs.com.cn/aigc-static/intelligent-assistant',
        5: 'http://bwh.dataelite.trs.com.cn',
        6: `http://localhost:8080/login?id=${md5.hex(window.localStorage.getItem('AI_token'))}`,
        7: 'https://dataelite.trs.com.cn/ckm/web/demo'
      },
      applyList: [],
      applyLoading: false,
      applyData: {},
      userInfo: {},
      numData: {},
      translateNum: 0,
      swiper: null
    };
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem('user_name'));
    this.getListApi();
    this.getNumApi();
  },
  mounted() {
    const swiper = new Swiper('.swiper-container', {
      // loop: true, // 循环
      slidesPerView: 5,
      spaceBetween: 16, // swiper-slide 间的距离为30
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable: true // 分页器点击
      // }, // 分页器
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      // autoplay: {
      //   delay: 3000, // 自动播放的间隔时间，单位ms，默认3000ms
      //   disableOnInteraction: false // 点击不会取消自动
      // }
    });
    this.swiper = swiper;
  },
  methods: {
    handleItem() {
      // console.log(item);
    },
    showMore() {
      this.$router.push({ name: 'apply-list' });
    },
    moveLeft() {
      if (this.canLeft) {
        this.translateNum += 243;
        const element = document.getElementById('itemBody');
        element.style.transform = `translateX(${this.translateNum}px)`;
        element.style.transition = 'all 0.5s';
        if (this.translateNum >= 0) {
          this.canLeft = false;
          this.canRight = true;
        }
      }
    },
    moveRight() {
      if (this.canRight) {
        this.translateNum -= 243;
        const element = document.getElementById('itemBody');
        element.style.transform = `translateX(${this.translateNum}px)`;
        element.style.transition = 'all 0.5s';
        if (this.translateNum <= -729) {
          this.canLeft = true;
          this.canRight = false;
        }
      }
    },
    linkJump(type) {
      if (type === 0) {
        this.showMore()
      } else {
        window.open(this.linkAdress[type], '_blank');
      }
    },
    getListApi() {
      this.applyLoading = true;
      const that = this;
      const data = {
        approvalStage: '',
        formManagementId: '',
        hasOpinions: '',
        id: that.userInfo.id,
        isOneTimePassed: '',
        keywords: '',
        name: that.userInfo.fullname,
        pageNow: 1,
        pageSize: 5,
        productLaunchDate: '',
        sortType: 4,
        startDate: '',
        urgent: ''
      };
      getList(data)
        .then((res) => {
          if (res.data.data.list.length > 0) {
            this.applyList = res.data.data.list.map((v) => {
              return {
                ...v,
                errorInfo:
                  v.errorInfo && v.errorInfo.indexOf('智能解析中') !== -1
                    ? ''
                    : v.errorInfo,
                ocr_approval_status:
                  v.errorInfo && v.errorInfo.indexOf('智能解析中') !== -1
                    ? '智能解析中，请您耐心等待...'
                    : v.ocr_approval_status,
                formId: v.taskNumber,
                recordId: v.taskNumber,
                taskStatus: v.submitted === 0 ? '0' : v.businessStatus,
                initiator: {
                  ...v.sponsorMap,
                  label: v.industryList && v.industryList[1]
                },
                processInstanceId: v.process_instance_id,
                currentAssignee:
                  v.currentAssignee && v.currentAssignee.length
                    ? v.currentAssignee.map((m) => {
                      return {
                        ...m,
                        hasReminder: false
                      }
                    })
                    : []
              }
            });
            this.applyData = res.data.data;
          }
          this.applyLoading = false;
        }).catch(() => {
          this.applyLoading = false;
        });
    },
    getNumApi() {
      this.applyLoading = true;
      const that = this;
      const data = {
        adoptionStatus: '',
        approvalStage: '',
        approvalType: '',
        currentActivityName: '',
        hasOpinions: '',
        id: that.userInfo.id,
        name: that.userInfo.fullname,
        pageNow: 1,
        pageSize: 10,
        urgent: '',
        sortType: 1,
      };
      getNum(data)
        .then((res) => {
          this.numData = res.data.data?.[0];
        }).catch(() => {});
    },
    estimateClass(type) {
      if (type) {
        if (type === '5') {
          return 'deep-green';
        } else if (type === '3') {
          return 'red';
        } else if (type === '4') {
          return 'green';
        } else {
          return 'orange';
        }
      }
    },
    getNodeStatus(value) {
      let nodeName = '';
      switch (value) {
        case '1':
          nodeName = '审批中';
          break;
        case '2':
          nodeName = '撤销';
          break;
        case '3':
          nodeName = '待修改';
          break;
        case '4':
          nodeName = '已结束';
          break;
        case '5':
          nodeName = '待确认';
          break;
        default:
      }
      return nodeName;
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
      .file-header-swiper {
        padding: 0 40px;
        height: 112px;
        position: absolute;
        height: 112px;
        width: 1280px;
        bottom: 4px;
        .swiper-button-prev, .swiper-button-next {
          position: absolute;
          bottom: -12px;
          width: 24px;
          height: 24px;
          opacity: 1;
          .no-hover {
            display: block;
          }
          .hover {
            display: none;
          }
          cursor: pointer;
          img {
            width: 24px;
            height: 24px;
          }
        }
        .swiper-button-prev:hover {
          .no-hover {
            display: none;
          }
          .hover {
            display: block;
          }
        }
        .swiper-button-next:hover {
          .no-hover {
            display: none;
          }
          .hover {
            display: block;
          }
        }
        .swiper-button-prev::after{
          content: '';
        }
        .swiper-button-next::after{
          content: '';
        }
      }
      .link-body {
        position: absolute;
        width: 1200px;
        height: 112px;
        bottom: 4px;
        // margin: 0 40px;
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
                .event-status {
                  display: flex;

                  .tag {
                    margin-left: 12px;
                    display: inline-block;
                    padding: 2px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                    display: flex;
                    align-items: center;

                    .icon {
                      width: 20px;
                      height: 20px;
                      line-height: 22px;
                      margin-right: 4px;
                    }
                  }

                  .draft {
                    background: #f0f6ff;
                    color: #2d5cf6;
                  }

                  .end-sign {
                    background: #ecfeec;
                    color: #50b142;
                  }

                  .has-opinion {
                    color: #fff;
                    border-radius: 0px 6px 6px 6px;
                    background: linear-gradient(90deg, #e85167 0%, #ff8193 100%);

                    i {
                      font-size: 16px;
                    }
                  }

                  .has-no-opinion {
                    border-radius: 0px 6px 6px 6px;
                    color: #fff;
                    background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 100%);

                    i {
                      font-size: 16px;
                    }
                  }

                  .no-opinion {
                    background: #e7f0ff;
                    color: #2d5cf6;
                  }

                  .in-modify {
                    background: #fff1f0;
                    color: #eb5757;
                  }

                  .adoption {
                    border-radius: 8px;
                    border: 1px solid #f2f3f5;
                    background: #e7f0ff;
                    color: #2d5cf6;
                  }

                  .check {
                    border-radius: 4px;
                    background: #e6fffb;
                    color: #0da5aa;
                  }

                  .in-approval {
                    border-radius: 4px;
                    background: #fff7e6;
                    color: #fa8c16;
                  }
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
